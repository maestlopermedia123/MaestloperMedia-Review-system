'use client';

export default function RazorpayButton({
  userId,
  taskId,
  taskSubmissionId,
  amount,
}) {
  
  const handlePayment = async () => {
    try {
      // Use NEXT_PUBLIC_RAZORPAY_KEY_ID for client-side
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      // console.log('Razorpay Key ID:', razorpayKey);
      // console.log('Is key defined?', !!razorpayKey);
      
      // Check if Razorpay key is available
      if (!razorpayKey) {
        alert('Payment configuration error. Razorpay key is missing.');
        console.error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not set. Check your .env.local file.');
        return;
      }
      
      console.log('Payment button clicked with props:', {
        userId,
        taskId,
        taskSubmissionId,
        amount
      });
      
      // Check if all required props are present
      if (!userId || !taskId || !taskSubmissionId || !amount) {
        console.error('Missing required props:', {
          userId,
          taskId,
          taskSubmissionId,
          amount
        });
        alert('Missing required information. Cannot process payment.');
        return;
      }

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
        key: razorpayKey, // Use the variable here
        amount: order.amount,
        currency: 'INR',
        name: 'Task Payment',
        description: `Payment for Task Submission: ${taskId}`,
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
              userId,
              taskId,
              taskSubmissionId,
              amount
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert('Payment Successful 🎉');
            // Call your success handler if needed
          } else {
            alert('Payment Verification Failed ❌');
          }
        },

        theme: {
          color: '#0f172a',
        },
        
        // Add prefilled user information
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
      };

      // 4️⃣ Open Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      // Handle payment failure
      razorpay.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });
    } catch (err) {
      console.error('Payment error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors"
    >
      Pay {amount}
    </button>
  );
}