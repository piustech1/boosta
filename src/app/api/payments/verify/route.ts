import { NextRequest, NextResponse } from 'next/server';
import { PaymentSecurityEngine } from '@/lib/security/payment-verifier';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required for verification.' },
        { status: 400 }
      );
    }

    const tx = PaymentSecurityEngine.getTransaction(transactionId);
    if (!tx) {
      return NextResponse.json(
        { error: 'Transaction reference not found in payment ledger.' },
        { status: 404 }
      );
    }

    // Check age (Expiry after 5 minutes)
    const isStale = PaymentSecurityEngine.isDuplicateOrStale(transactionId, Math.floor(tx.createdAt / 1000));
    if (isStale && tx.status !== 'SUCCESSFUL') {
      tx.status = 'EXPIRED';
      return NextResponse.json({
        success: false,
        status: 'EXPIRED',
        message: 'Payment session expired. Please create a new order payment request.',
        transaction: tx,
      });
    }

    // Verify & finalize transaction atomically with anti-duplicate idempotency
    const { success, alreadyProcessed, transaction } = PaymentSecurityEngine.verifyAndFinalizePayment(transactionId);

    if (!success || !transaction) {
      return NextResponse.json(
        { error: 'Unable to verify payment confirmation with provider.' },
        { status: 402 }
      );
    }

    if (alreadyProcessed) {
      console.log(`[Idempotent Return] Tx ${transactionId} already confirmed. Returning existing order ${transaction.orderId}`);
    } else {
      console.log(`[Order Created] Payment verified for Tx ${transactionId} -> Order ${transaction.orderId}`);
    }

    return NextResponse.json({
      success: true,
      status: 'SUCCESSFUL',
      alreadyProcessed,
      order: {
        id: transaction.orderId,
        transactionId: transaction.transactionId,
        platform: transaction.platform,
        boostType: transaction.boostType,
        quantity: transaction.quantity,
        destinationUrl: transaction.destinationUrl,
        amount: transaction.amount,
        currency: transaction.currency,
        paymentMethod: transaction.paymentMethod,
        verifiedAt: transaction.verifiedAt,
      },
    });
  } catch (error) {
    console.error('[Payment Verify Error]', error);
    return NextResponse.json(
      { error: 'Internal server error verifying payment.' },
      { status: 500 }
    );
  }
}
