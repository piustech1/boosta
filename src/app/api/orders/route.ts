import { NextRequest, NextResponse } from 'next/server';
import { PaymentSecurityEngine, DirectPaymentTransaction } from '@/lib/security/payment-verifier';

export async function GET(req: NextRequest) {
  try {
    const transactions = PaymentSecurityEngine.getAllTransactions();

    // Map transactions to user-facing orders
    const orders = transactions.map((tx: DirectPaymentTransaction) => ({
      id: tx.orderId,
      transactionId: tx.transactionId,
      platform: tx.platform,
      boostType: tx.boostType,
      quantity: tx.quantity,
      destinationUrl: tx.destinationUrl,
      amount: tx.amount,
      currency: tx.currency,
      paymentMethod: tx.paymentMethod,
      status: tx.status === 'SUCCESSFUL' ? 'COMPLETED' : tx.status,
      createdAt: tx.createdAt,
      verifiedAt: tx.verifiedAt,
    }));

    // Calculate confirmed lifetime spending (only SUCCESSFUL/COMPLETED)
    const confirmedOrders = orders.filter((o) => o.status === 'COMPLETED');
    const totalSpentConfirmed = confirmedOrders.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'PENDING');
    const failedOrders = orders.filter((o) => o.status === 'FAILED' || o.status === 'CANCELLED' || o.status === 'EXPIRED');

    return NextResponse.json({
      success: true,
      orders,
      metrics: {
        totalSpentConfirmed,
        totalOrders: orders.length,
        confirmedCount: confirmedOrders.length,
        pendingCount: pendingOrders.length,
        failedCount: failedOrders.length,
      },
    });
  } catch (error) {
    console.error('[API /api/orders Error]', error);
    return NextResponse.json(
      { error: 'Failed to retrieve orders.' },
      { status: 500 }
    );
  }
}
