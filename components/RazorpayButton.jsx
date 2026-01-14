'use client';

export default function RazorpayButton({
  userId,
  taskId,
  taskSubmissionId,
  amount,
}) {
  const handlePayment = async () => {
    try {
      // 1️⃣ Create Order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          taskId,
          taskSubmissionId,
          amount,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error('Order creation failed');

      const { order } = data;

      // 2️⃣ Razorpay Checkout Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Task Payment',
        description: 'Task submission payment',
        order_id: order.id,

        handler: async function (response) {
          // 3️⃣ Verify Payment
          const verifyRes = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert('Payment Successful 🎉');
          } else {
            alert('Payment Verification Failed ❌');
          }
        },

        theme: {
          color: '#0f172a',
        },
      };

      // 4️⃣ Open Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-6 py-3 bg-black text-white rounded-xl"
    >
      Pay ₹{amount}
    </button>
  );
}
