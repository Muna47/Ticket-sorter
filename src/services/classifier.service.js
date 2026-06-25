const { CASE_TYPES, DEPARTMENTS } = require("../config/constants");

const categoryRules = {
  [CASE_TYPES.PHISHING]: {
    keywords: [
      "otp",
      "pin",
      "password",
      "scam",
      "fraud",
      "suspicious call",
      "verification code",
      "one time password",

      // Bangla
      "ওটিপি",
      "পিন",
      "পাসওয়ার্ড",
      "প্রতারক",
      "প্রতারণা",
    ],
    severity: "critical",
    department: DEPARTMENTS.FRAUD_RISK,
    confidence: 0.95,
    summary:
      "Customer reports suspicious activity involving account credentials or possible social engineering.",
  },

  [CASE_TYPES.WRONG_TRANSFER]: {
    keywords: [
      "wrong number",
      "wrong recipient",
      "sent money to wrong",
      "wrong transfer",
      "sent to wrong account",

      // Bangla
      "ভুল নম্বর",
      "ভুল একাউন্ট",
      "ভুলে টাকা পাঠিয়েছি",
      "ভুল ব্যক্তিকে টাকা পাঠিয়েছি",
    ],
    severity: "high",
    department: DEPARTMENTS.DISPUTE_RESOLUTION,
    confidence: 0.92,
    summary:
      "Customer reports sending funds to an incorrect recipient and requests assistance.",
  },

  [CASE_TYPES.PAYMENT_FAILED]: {
    keywords: [
      "payment failed",
      "transaction failed",
      "balance deducted",
      "money deducted",
      "payment unsuccessful",
      "failed transaction",

      // Bangla
      "পেমেন্ট ব্যর্থ",
      "টাকা কেটে নিয়েছে",
      "লেনদেন ব্যর্থ",
      "পেমেন্ট হয়নি",
    ],
    severity: "high",
    department: DEPARTMENTS.PAYMENTS_OPS,
    confidence: 0.9,
    summary:
      "Customer reports a failed payment or transaction with possible balance deduction.",
  },

  [CASE_TYPES.REFUND_REQUEST]: {
    keywords: [
      "refund",
      "money back",
      "return my money",
      "cancel payment",
      "reverse payment",

      // Bangla
      "রিফান্ড",
      "টাকা ফেরত",
      "ফেরত চাই",
      "টাকা ফেরত দিন",
    ],
    severity: "low",
    department: DEPARTMENTS.CUSTOMER_SUPPORT,
    confidence: 0.88,
    summary: "Customer requests a refund related to a previous transaction.",
  },
};

function countMatches(text, keywords) {
  let score = 0;

  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      score++;
    }
  }

  return score;
}

function classifyTicket(ticket) {
  const { ticket_id, message } = ticket;

  const text = message.toLowerCase();

  let bestMatch = {
    type: CASE_TYPES.OTHER,
    score: 0,
  };

  for (const [caseType, config] of Object.entries(categoryRules)) {
    const score = countMatches(text, config.keywords);

    if (score > bestMatch.score) {
      bestMatch = {
        type: caseType,
        score,
      };
    }
  }

  if (bestMatch.type === CASE_TYPES.OTHER) {
    return {
      ticket_id,

      case_type: CASE_TYPES.OTHER,

      severity: "low",

      department: DEPARTMENTS.CUSTOMER_SUPPORT,

      agent_summary:
        "Customer reports a general service issue requiring review.",

      human_review_required: false,

      confidence: 0.6,
    };
  }

  const selected = categoryRules[bestMatch.type];

  return {
    ticket_id,

    case_type: bestMatch.type,

    severity: selected.severity,

    department: selected.department,

    agent_summary: selected.summary,

    human_review_required: selected.severity === "critical",

    confidence: selected.confidence,
  };
}

module.exports = classifyTicket;
