import { NextRequest, NextResponse } from 'next/server';
import { PaymentSecurityEngine, PaymentMethod } from '@/lib/security/payment-verifier';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { boostType, platform, quantity, destinationUrl, amount, paymentMethod, phoneNumber } = body;

    // Validate required fields
    if (!boostType || !platform || !quantity || !destinationUrl || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required order payment parameters.' },
        { status: 400 }
      );
    }

    // Validate supported payment method
    const supportedMethods: PaymentMethod[] = ['mtn_momo', 'airtel_money', 'card'];
    if (!supportedMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: `Payment method "${paymentMethod}" is not supported.` },
        { status: 400 }
      );
    }

    // Validate Mobile Money phone number format if MoMo
    if ((paymentMethod === 'mtn_momo' || paymentMethod === 'airtel_money') && !phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required for mobile money authorization.' },
        { status: 400 }
      );
    }

    // Server-Side Rate Validation (Prevents client tampering)
    const { isValid, calculatedAmount } = PaymentSecurityEngine.validateServerPrice(
      boostType,
      Number(quantity),
      Number(amount)
    );

    if (!isValid) {
      console.warn(`[Security Alert] Client price tampering detected: client ${amount} vs server ${calculatedAmount}`);
      return NextResponse.json(
        { error: `Invalid order total. Calculated price is UGX ${calculatedAmount.toLocaleString()}.` },
        { status: 400 }
      );
    }

    // Initiate secure transaction
    const transaction = PaymentSecurityEngine.initiateDirectPayment({
      boostType,
      platform,
      quantity: Number(quantity),
      destinationUrl,
      amount: calculatedAmount,
      paymentMethod,
      phoneNumber,
    });

    console.log(`[Direct Payment Initiated] Tx: ${transaction.transactionId} | Order: ${transaction.orderId} | UGX ${calculatedAmount}`);

    return NextResponse.json({
      success: true,
      transaction,
      instructions:
        paymentMethod === 'card'
          ? 'Card authorization initialized.'
          : `A USSD push prompt of UGX ${calculatedAmount.toLocaleString()} has been dispatched to ${phoneNumber}. Please enter your PIN to approve.`,
    });
  } catch (error) {
    console.error('[Payment Initiate Error]', error);
    return NextResponse.json(
      { error: 'Internal server error initiating payment.' },
      { status: 500 }
    );
  }
}
