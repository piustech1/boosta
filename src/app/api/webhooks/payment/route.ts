import { NextRequest, NextResponse } from 'next/server';
import { PaymentSecurityEngine, PaymentWebhookPayload } from '@/lib/security/payment-verifier';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || req.headers.get('x-webhook-signature') || '';

    // Step 1: Cryptographic HMAC validation
    const isValidSignature = PaymentSecurityEngine.verifySignature(rawBody, signature);
    if (!isValidSignature) {
      console.warn('[Security Alert] Blocked unauthenticated/forged webhook attempt!');
      return NextResponse.json(
        { error: 'Unauthorized: Invalid cryptographic signature.' },
        { status: 401 }
      );
    }

    const payload: PaymentWebhookPayload = JSON.parse(rawBody);

    // Step 2: Strict Amount & Payload validation
    if (!payload.amount || payload.amount <= 0 || !payload.transactionId || !payload.userId) {
      return NextResponse.json(
        { error: 'Malformed payload or invalid amount.' },
        { status: 400 }
      );
    }

    // Step 3: Anti-Replay Idempotency Check
    if (PaymentSecurityEngine.isDuplicateOrStale(payload.transactionId, payload.timestamp)) {
      console.warn(`[Security Alert] Replay attempt blocked for txId: ${payload.transactionId}`);
      return NextResponse.json(
        { error: 'Duplicate or expired transaction.' },
        { status: 409 }
      );
    }

    // Step 4: Two-Way Server Outgoing Handshake
    const isConfirmedByGateway = await PaymentSecurityEngine.verifyDirectWithGateway(
      payload.transactionId,
      payload.amount
    );

    if (!isConfirmedByGateway) {
      return NextResponse.json(
        { error: 'Transaction unverified with payment provider.' },
        { status: 402 }
      );
    }

    // Step 5: Atomic Balance Crediting
    PaymentSecurityEngine.recordTransaction(payload.transactionId);
    console.log(`[Payment Verified] Successfully credited $${payload.amount} to user ${payload.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and credited securely.',
      transactionId: payload.transactionId,
    });
  } catch (error) {
    console.error('[Payment Error]', error);
    return NextResponse.json(
      { error: 'Internal server error processing payment.' },
      { status: 500 }
    );
  }
}
