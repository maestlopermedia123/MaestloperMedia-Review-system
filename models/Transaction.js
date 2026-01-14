import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    // Who made the payment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Which task was paid for
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },

    // Which submission this payment belongs to
    taskSubmissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaskSubmission',
      required: true,
    },

    // Amount paid (in INR)
    amount: {
      type: Number,
      required: true,
    },

    // Razorpay specific fields
    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
    },

    razorpaySignature: {
      type: String,
    },

    // Payment status
    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model('Transaction', TransactionSchema);
