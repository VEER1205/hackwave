let currentCaseIndex = 0;
let currentSuspectIndex = 0;
let casesSolved = 0;
let correctAccusations = 0;
let totalRedFlagsFound = 0;

const cases = [
  {
    id: "CF-001",
    intro:
      "Funds for a marketing campaign have vanished. The transfer was authorized, but the money never reached the intended vendor.",
    victim: "Sunrise Investments",
    amount: "₹5,00,000",
    timeframe: "Sept 1, 2023 - Nov 15, 2023",
    location: "Mumbai, India",
    suspects: [
      {
        name: "Priya Sharma",
        title: "Marketing Manager",
        description:
          "Ambitious and under financial pressure due to a family emergency.",
        transactions: [
          {
            date: "2023-09-01",
            description: "Salary Deposit",
            amount: 90000,
            balance: 250000,
          },
          {
            date: "2023-09-05",
            description: "Utility Bill Payment",
            amount: -8000,
            balance: 242000,
          },
          {
            date: "2023-09-10",
            description: "Credit Card Payment",
            amount: -40000,
            balance: 202000,
          },
          {
            date: "2023-09-15",
            description: "Cash Deposit - Unexplained",
            amount: 250000,
            balance: 452000,
          },
          {
            date: "2023-09-22",
            description: "Online Shopping",
            amount: -12000,
            balance: 440000,
          },
          {
            date: "2023-10-01",
            description: "Salary Deposit",
            amount: 90000,
            balance: 530000,
          },
          {
            date: "2023-10-05",
            description: "Payment to 'Unknown Recipient'",
            amount: -250000,
            balance: 280000,
          },
          {
            date: "2023-10-12",
            description: "Luxury Handbag Purchase",
            amount: -75000,
            balance: 205000,
          },
          {
            date: "2023-10-25",
            description: "Grocery Shopping",
            amount: -15000,
            balance: 190000,
          },
        ],
        culprit: true,
        solution:
          "Priya was coerced by an external fraudster through a phishing scam, diverting ₹5,00,000 in two transactions. The cash deposit and 'Unknown Recipient' payment are the key evidence.",
      },
      {
        name: "Neha Patel",
        title: "Finance Controller",
        description:
          "Meticulous about procedures and oversees accounting operations.",
        transactions: [
          {
            date: "2023-09-01",
            description: "Salary Deposit",
            amount: 120000,
            balance: 420000,
          },
          {
            date: "2023-09-05",
            description: "Home Loan EMI",
            amount: -55000,
            balance: 365000,
          },
          {
            date: "2023-09-15",
            description: "Mutual Fund Investment",
            amount: -50000,
            balance: 315000,
          },
          {
            date: "2023-09-25",
            description: "Insurance Premium",
            amount: -15000,
            balance: 300000,
          },
          {
            date: "2023-10-01",
            description: "Salary Deposit",
            amount: 120000,
            balance: 420000,
          },
          {
            date: "2023-10-08",
            description: "Gold Purchase",
            amount: -80000,
            balance: 340000,
          },
          {
            date: "2023-10-18",
            description: "Children's School Fees",
            amount: -45000,
            balance: 295000,
          },
          {
            date: "2023-11-01",
            description: "Salary Deposit",
            amount: 120000,
            balance: 415000,
          },
          {
            date: "2023-11-03",
            description: "Home Renovation",
            amount: -100000,
            balance: 315000,
          },
        ],
        culprit: false,
        solution:
          "Neha's transactions show responsible financial management. Her large expenditures are accounted for by her consistent income.",
      },
      {
        name: "Rahul Desai",
        title: "IT Director",
        description: "Manages company tech. Recently invested in a startup.",
        transactions: [
          {
            date: "2023-09-01",
            description: "Salary Deposit",
            amount: 180000,
            balance: 650000,
          },
          {
            date: "2023-09-07",
            description: "Rent Payment",
            amount: -60000,
            balance: 590000,
          },
          {
            date: "2023-09-10",
            description: "Startup Investment",
            amount: -200000,
            balance: 390000,
          },
          {
            date: "2023-09-18",
            description: "Car EMI",
            amount: -35000,
            balance: 355000,
          },
          {
            date: "2023-10-01",
            description: "Salary Deposit",
            amount: 180000,
            balance: 535000,
          },
          {
            date: "2023-10-10",
            description: "Electronics Purchase",
            amount: -90000,
            balance: 445000,
          },
          {
            date: "2023-10-18",
            description: "Startup Additional Investment",
            amount: -100000,
            balance: 345000,
          },
          {
            date: "2023-11-01",
            description: "Salary Deposit",
            amount: 180000,
            balance: 525000,
          },
          {
            date: "2023-11-07",
            description: "Investment - Crypto",
            amount: -50000,
            balance: 475000,
          },
        ],
        culprit: false,
        solution:
          "Rahul's investments in legitimate startups align with his high income, showing no signs of fraudulent activity.",
      },
    ],
    debriefing: {
      crime_type: "Business Email Compromise (BEC)",
      red_flags: [
        "A large, unexplained cash deposit that breaks from the normal pattern of salary income.",
        "A subsequent large payment to a vaguely described 'Unknown Recipient'.",
        "The total of the two suspicious transactions (₹250,000 + ₹250,000) exactly matches the amount of missing funds (₹500,000).",
        "An expensive luxury purchase shortly after receiving illicit funds.",
      ],
      prevention_individual:
        "Be extremely skeptical of urgent payment requests, even from known contacts. Always verify requests to change payment details or send money to new accounts using a secondary method, like a phone call to a trusted number.",
      prevention_business:
        "Implement a multi-person approval process for any payments above a certain threshold or any changes to vendor bank details. Regular employee training on identifying phishing and social engineering attacks is critical.",
      financial_concept: "Payment Verification",
      concept_explanation:
        "This case highlights the vital importance of multi-factor payment verification. A financial system should never rely on a single point of failure (like one person's email). By requiring confirmation from a separate channel, most BEC fraud can be prevented.",
    },
  },
  {
    id: "VG-002",
    intro:
      "Irregularities found in expense reports. Payments were made to a vendor, 'Digital Solutions Co.', that doesn't seem to exist.",
    victim: "Innovate Corp",
    amount: "₹2,80,000",
    timeframe: "Oct 1, 2024 - Dec 31, 2024",
    location: "Mumbai, India",
    suspects: [
      {
        name: "Vikram Singh",
        title: "Department Head",
        description:
          "Signs off on all major purchases. Lives a lavish lifestyle.",
        transactions: [
          {
            date: "2024-10-01",
            description: "Salary + Bonus",
            amount: 450000,
            balance: 1800000,
          },
          {
            date: "2024-10-10",
            description: "Luxury Watch Purchase",
            amount: -300000,
            balance: 1500000,
          },
          {
            date: "2024-10-15",
            description: "Business Dinner",
            amount: -25000,
            balance: 1475000,
          },
          {
            date: "2024-10-25",
            description: "Golf Club Membership",
            amount: -150000,
            balance: 1325000,
          },
          {
            date: "2024-11-01",
            description: "Salary",
            amount: 250000,
            balance: 1575000,
          },
          {
            date: "2024-11-12",
            description: "Home Utility Bills",
            amount: -30000,
            balance: 1545000,
          },
          {
            date: "2024-11-20",
            description: "International Travel",
            amount: -200000,
            balance: 1345000,
          },
          {
            date: "2024-12-01",
            description: "Salary",
            amount: 250000,
            balance: 1595000,
          },
          {
            date: "2024-12-10",
            description: "Charity Donation",
            amount: -50000,
            balance: 1545000,
          },
        ],
        culprit: false,
        solution:
          "While Vikram's lifestyle is expensive, his income, including a documented annual bonus, supports his spending. There are no direct links to the phantom vendor.",
      },
      {
        name: "Anjali Mehta",
        title: "Procurement Specialist",
        description:
          "Handles vendor registration and payment processing. Recently bought a new car.",
        transactions: [
          {
            date: "2024-10-05",
            description: "Salary Deposit",
            amount: 75000,
            balance: 180000,
          },
          {
            date: "2024-10-12",
            description: "Rent Payment",
            amount: -30000,
            balance: 150000,
          },
          {
            date: "2024-10-20",
            description: "Transfer from Digital Solutions",
            amount: 140000,
            balance: 290000,
          },
          {
            date: "2024-10-22",
            description: "Car Down Payment",
            amount: -250000,
            balance: 40000,
          },
          {
            date: "2024-11-05",
            description: "Salary Deposit",
            amount: 75000,
            balance: 115000,
          },
          {
            date: "2024-11-15",
            description: "Credit Card Bill",
            amount: -20000,
            balance: 95000,
          },
          {
            date: "2024-11-21",
            description: "Transfer from Digital Solutions",
            amount: 140000,
            balance: 235000,
          },
          {
            date: "2024-11-25",
            description: "Online Shopping",
            amount: -15000,
            balance: 220000,
          },
          {
            date: "2024-12-05",
            description: "Salary Deposit",
            amount: 75000,
            balance: 295000,
          },
        ],
        culprit: true,
        solution:
          "Anjali created the fake vendor 'Digital Solutions Co.' and approved payments to an account she controlled. The two payments of ₹1,40,000 match the missing funds and precede her large car purchase.",
      },
      {
        name: "Sameer Joshi",
        title: "Junior Accountant",
        description:
          "Cross-checks invoices with payments. Known to be diligent but overworked.",
        transactions: [
          {
            date: "2024-10-10",
            description: "Salary Deposit",
            amount: 40000,
            balance: 95000,
          },
          {
            date: "2024-10-15",
            description: "Rent Payment",
            amount: -20000,
            balance: 75000,
          },
          {
            date: "2024-10-20",
            description: "Grocery",
            amount: -8000,
            balance: 67000,
          },
          {
            date: "2024-10-28",
            description: "Mobile Recharge",
            amount: -1000,
            balance: 66000,
          },
          {
            date: "2024-11-10",
            description: "Salary Deposit",
            amount: 40000,
            balance: 106000,
          },
          {
            date: "2024-11-15",
            description: "Rent Payment",
            amount: -20000,
            balance: 86000,
          },
          {
            date: "2024-11-25",
            description: "Medical Bill",
            amount: -30000,
            balance: 56000,
          },
          {
            date: "2024-12-02",
            description: "Public Transport Pass",
            amount: -2000,
            balance: 54000,
          },
          {
            date: "2024-12-10",
            description: "Salary Deposit",
            amount: 40000,
            balance: 94000,
          },
        ],
        culprit: false,
        solution:
          "Sameer's financial records show a modest income and expenses. There is no evidence of unexplained wealth or any connection to the fraudulent transactions.",
      },
    ],
    debriefing: {
      crime_type: "Phantom Vendor Fraud",
      red_flags: [
        "Two large, identical deposits from an unknown entity ('Digital Solutions').",
        "The sum of these deposits (₹140,000 + ₹140,000) equals the missing amount (₹280,000).",
        "A major purchase (Car Down Payment) that is not supported by the suspect's regular salary.",
        "The illicit income directly precedes the large expense, suggesting a direct link.",
      ],
      prevention_individual:
        "Be cautious when your lifestyle expenses significantly exceed your known income. This can be a major red flag for auditors and investigators.",
      prevention_business:
        "The core defense is **Segregation of Duties**. The person authorized to create/add a new vendor into the system should not be the same person authorized to approve payments. This single control makes this type of fraud significantly harder.",
      financial_concept: "Internal Controls",
      concept_explanation:
        "This case is a lesson in the necessity of strong Internal Controls. These are rules and procedures a company uses to prevent fraud and errors. A simple control like Segregation of Duties protects both the company's assets and its employees from temptation and suspicion.",
    },
  },
  {
    id: "PG-003",
    intro:
      "An internal audit finds a former employee, resigned three months ago, is still on the payroll. A total of ₹1,80,000 is missing.",
    victim: "Zenith Pharma",
    amount: "₹1,80,000",
    timeframe: "June 1, 2025 - Aug 31, 2025",
    location: "Mumbai, India",
    suspects: [
      {
        name: "Rohan Kapoor",
        title: "HR Manager",
        description:
          "Responsible for managing employee records. Has been complaining about being underpaid.",
        transactions: [
          {
            date: "2025-06-05",
            description: "Salary Deposit",
            amount: 95000,
            balance: 210000,
          },
          {
            date: "2025-06-10",
            description: "Transfer from 'RK Enterprises'",
            amount: 60000,
            balance: 270000,
          },
          {
            date: "2025-06-20",
            description: "Car Service",
            amount: -15000,
            balance: 255000,
          },
          {
            date: "2025-07-05",
            description: "Salary Deposit",
            amount: 95000,
            balance: 350000,
          },
          {
            date: "2025-07-11",
            description: "Transfer from 'RK Enterprises'",
            amount: 60000,
            balance: 410000,
          },
          {
            date: "2025-07-22",
            description: "Home Appliance Purchase",
            amount: -40000,
            balance: 370000,
          },
          {
            date: "2025-08-05",
            description: "Salary Deposit",
            amount: 95000,
            balance: 465000,
          },
          {
            date: "2025-08-10",
            description: "Transfer from 'RK Enterprises'",
            amount: 60000,
            balance: 525000,
          },
          {
            date: "2025-08-15",
            description: "Stock Market Investment",
            amount: -150000,
            balance: 375000,
          },
        ],
        culprit: true,
        solution:
          "Rohan kept the ex-employee on the payroll and diverted the ₹60,000 monthly salary to a shell company account, 'RK Enterprises'. The three suspicious transfers perfectly match the missing amount.",
      },
      {
        name: "Priya Singh",
        title: "Ex-Employee",
        description: "The former employee in question. Left for a competitor.",
        transactions: [
          {
            date: "2025-06-01",
            description: "Zenith Pharma Final Settlement",
            amount: 85000,
            balance: 150000,
          },
          {
            date: "2025-06-10",
            description: "Rent Payment",
            amount: -25000,
            balance: 125000,
          },
          {
            date: "2025-06-20",
            description: "Utility Bills",
            amount: -5000,
            balance: 120000,
          },
          {
            date: "2025-07-01",
            description: "Salary from New employer",
            amount: 70000,
            balance: 190000,
          },
          {
            date: "2025-07-10",
            description: "Rent Payment",
            amount: -25000,
            balance: 165000,
          },
          {
            date: "2025-08-01",
            description: "Salary from New employer",
            amount: 70000,
            balance: 235000,
          },
          {
            date: "2025-08-10",
            description: "Rent Payment",
            amount: -25000,
            balance: 210000,
          },
          {
            date: "2025-08-20",
            description: "Security Deposit for New Flat",
            amount: -100000,
            balance: 110000,
          },
          {
            date: "2025-08-25",
            description: "Moving Expenses",
            amount: -20000,
            balance: 90000,
          },
        ],
        culprit: false,
        solution:
          "Priya's records clearly show she stopped receiving payments from Zenith Pharma after her final settlement. Her income is legitimate and comes from her new job.",
      },
      {
        name: "Meera Desai",
        title: "Finance Head",
        description:
          "Authorizes the total monthly payroll but doesn't review individual disbursements.",
        transactions: [
          {
            date: "2025-06-01",
            description: "Salary Deposit",
            amount: 350000,
            balance: 2500000,
          },
          {
            date: "2025-06-15",
            description: "Home Loan Payment",
            amount: -120000,
            balance: 2380000,
          },
          {
            date: "2025-07-01",
            description: "Salary Deposit",
            amount: 350000,
            balance: 2730000,
          },
          {
            date: "2025-07-10",
            description: "Investment Portfolio Deposit",
            amount: -200000,
            balance: 2530000,
          },
          {
            date: "2025-07-25",
            description: "Tax Payment",
            amount: -400000,
            balance: 2130000,
          },
          {
            date: "2025-08-01",
            description: "Salary Deposit",
            amount: 350000,
            balance: 2480000,
          },
          {
            date: "2025-08-15",
            description: "Home Loan Payment",
            amount: -120000,
            balance: 2360000,
          },
          {
            date: "2025-08-20",
            description: "Travel Expenses",
            amount: -150000,
            balance: 2210000,
          },
          {
            date: "2025-08-28",
            description: "Credit Card Payments",
            amount: -80000,
            balance: 2130000,
          },
        ],
        culprit: false,
        solution:
          "As a high-level executive, Meera's income and expenditures are substantial but consistent. There is no evidence of her receiving small, suspicious amounts.",
      },
    ],
    debriefing: {
      crime_type: "Payroll Fraud (Ghost Employee)",
      red_flags: [
        "A pattern of recurring monthly deposits from a suspicious source ('RK Enterprises').",
        "The amount of these deposits (₹60,000) exactly matches the ghost employee's salary.",
        "The total of the fraudulent deposits (₹60,000 x 3) equals the total missing amount (₹180,000).",
        "The suspect accumulates a large sum of illicit money and then makes a significant investment.",
      ],
      prevention_individual:
        "Never mix personal and business finances in a way that obscures the source of funds. Legitimate side businesses should have clear, transparent records.",
      prevention_business:
        "A robust employee termination checklist is essential. When an employee leaves, HR must have a formal, mandatory process to notify Payroll to deactivate them. Payroll should then conduct monthly audits to reconcile the list of active employees with the salary disbursements.",
      financial_concept: "Reconciliation",
      concept_explanation:
        "This case teaches the importance of Reconciliation. This is the process of comparing two sets of records to ensure they match. By regularly reconciling the HR employee list with the payroll list, the 'ghost' would have been discovered in the first month, preventing further losses.",
    },
  },
  {
    id: "AC-004",
    intro:
      "A check for ₹1,00,000 to 'Steel Beams Inc.' was never received. Investigation shows the check was cashed for ₹8,50,000, paid to 'Steel Dreams Inc.'",
    victim: "Atlas Construction",
    amount: "₹7,50,000",
    timeframe: "July 15, 2025 - July 30, 2025",
    location: "Mumbai, India",
    suspects: [
      {
        name: "Sunita Rao",
        title: "Office Manager",
        description:
          "Handles all outgoing mail, including posting signed checks.",
        transactions: [
          {
            date: "2025-07-05",
            description: "Salary Deposit",
            amount: 65000,
            balance: 110000,
          },
          {
            date: "2025-07-10",
            description: "Rent",
            amount: -28000,
            balance: 82000,
          },
          {
            date: "2025-07-15",
            description: "School Fee Payment",
            amount: -30000,
            balance: 52000,
          },
          {
            date: "2025-07-20",
            description: "Electricity Bill",
            amount: -4000,
            balance: 48000,
          },
          {
            date: "2025-07-25",
            description: "Groceries",
            amount: -10000,
            balance: 38000,
          },
          {
            date: "2025-08-05",
            description: "Salary Deposit",
            amount: 65000,
            balance: 103000,
          },
          {
            date: "2025-08-10",
            description: "Rent",
            amount: -28000,
            balance: 75000,
          },
          {
            date: "2025-08-18",
            description: "Mutual Fund SIP",
            amount: -5000,
            balance: 70000,
          },
        ],
        culprit: false,
        solution:
          "Sunita's finances are modest and show no signs of a large, sudden influx of cash. She had no opportunity to alter and cash the check.",
      },
      {
        name: "David Martin",
        title: "Accounts Payable Clerk",
        description:
          "Prepares checks for suppliers. Known to be in significant personal debt.",
        transactions: [
          {
            date: "2025-07-03",
            description: "Salary Deposit",
            amount: 50000,
            balance: 15000,
          },
          {
            date: "2025-07-08",
            description: "Loan EMI Missed Penalty",
            amount: -2000,
            balance: 13000,
          },
          {
            date: "2025-07-15",
            description: "Cash Withdrawal",
            amount: -10000,
            balance: 3000,
          },
          {
            date: "2025-07-20",
            description: "Unidentified Cash Deposit",
            amount: 745000,
            balance: 748000,
          },
          {
            date: "2025-07-21",
            description: "Personal Loan Settlement",
            amount: -400000,
            balance: 348000,
          },
          {
            date: "2025-07-21",
            description: "Credit Card Full Payment",
            amount: -350000,
            balance: -2000,
          },
          {
            date: "2025-07-22",
            description: "Cash Deposit to clear overdraft",
            amount: 5000,
            balance: 3000,
          },
          {
            date: "2025-08-03",
            description: "Salary Deposit",
            amount: 50000,
            balance: 53000,
          },
          {
            date: "2025-08-10",
            description: "New Phone Purchase",
            amount: -45000,
            balance: 8000,
          },
        ],
        culprit: true,
        solution:
          "David intercepted the check, altered the amount and payee, and cashed it via a shell company. The massive deposit, just under the stolen amount, followed by immediate debt repayments, is undeniable proof.",
      },
      {
        name: "Arun Verma",
        title: "Signing Authority / Director",
        description:
          "The director who signed the check. He reviews dozens of documents daily.",
        transactions: [
          {
            date: "2025-07-01",
            description: "Dividend Payout",
            amount: 1200000,
            balance: 9500000,
          },
          {
            date: "2025-07-10",
            description: "Property Tax",
            amount: -250000,
            balance: 9250000,
          },
          {
            date: "2025-07-15",
            description: "Maintenance Charges",
            amount: -50000,
            balance: 9200000,
          },
          {
            date: "2025-07-20",
            description: "Club Membership Fees",
            amount: -100000,
            balance: 9100000,
          },
          {
            date: "2025-08-01",
            description: "Business Investment",
            amount: -1000000,
            balance: 8100000,
          },
          {
            date: "2025-08-05",
            description: "Salary (Director's fees)",
            amount: 400000,
            balance: 8500000,
          },
          {
            date: "2025-08-15",
            description: "Car Purchase",
            amount: -2500000,
            balance: 6000000,
          },
          {
            date: "2025-08-25",
            description: "Share Purchase",
            amount: -500000,
            balance: 5500000,
          },
        ],
        culprit: false,
        solution:
          "Arun's personal finances operate on a much larger scale. He simply signed a check he believed to be legitimate, a common oversight in a busy role.",
      },
    ],
    debriefing: {
      crime_type: "Check Tampering Fraud",
      red_flags: [
        "A massive, one-time 'Unidentified Cash Deposit' that is completely out of character for the suspect's income level.",
        "The suspect immediately uses the fraudulent funds to pay off significant debts.",
        "The amount of the deposit (₹745,000) is suspiciously close to the amount of the fraud (₹750,000), accounting for a small fee for cashing the check.",
      ],
      prevention_individual:
        "Monitor your bank accounts regularly. If you still use physical checks, review the cleared check images provided by your bank to ensure the amount and payee have not been altered.",
      prevention_business:
        "The best defense is to transition to secure electronic payment systems (NEFT/RTGS). If checks are necessary, use a banking service called **Positive Pay**. Your company sends the bank a list of all issued checks. The bank will only clear checks that perfectly match the details on that list, automatically rejecting any altered checks.",
      financial_concept: "Payment System Security",
      concept_explanation:
        "This case demonstrates the inherent risks of outdated payment systems like physical checks. It highlights the value of modern, secure electronic systems and banking controls like Positive Pay, which create verifiable and difficult-to-tamper-with audit trails.",
    },
  },
  {
    id: "SS-005",
    intro:
      "The 'Global Tech Foundation' finds 8 scholarships of ₹50,000 each were awarded to fake students. A total of ₹4,00,000 was embezzled.",
    victim: "Global Tech Foundation",
    amount: "₹4,00,000",
    timeframe: "May 1, 2025 - Aug 31, 2025",
    location: "Mumbai, India",
    suspects: [
      {
        name: "Aisha Khan",
        title: "CSR Program Coordinator",
        description:
          "Manages scholarship applications and disbursements. Has sole approval authority under ₹1,00,000.",
        transactions: [
          {
            date: "2025-05-10",
            description: "Salary Deposit",
            amount: 80000,
            balance: 250000,
          },
          {
            date: "2025-05-20",
            description: "Online Subscription",
            amount: -2000,
            balance: 248000,
          },
          {
            date: "2025-06-10",
            description: "Salary Deposit",
            amount: 80000,
            balance: 328000,
          },
          {
            date: "2025-06-20",
            description: "Received 'Gift'",
            amount: 50000,
            balance: 378000,
          },
          {
            date: "2025-06-22",
            description: "Received 'Loan Repayment'",
            amount: 50000,
            balance: 428000,
          },
          {
            date: "2025-07-10",
            description: "Salary Deposit",
            amount: 80000,
            balance: 508000,
          },
          {
            date: "2025-07-18",
            description: "Received 'Gift'",
            amount: 50000,
            balance: 558000,
          },
          {
            date: "2025-07-25",
            description: "Received 'Family Support'",
            amount: 50000,
            balance: 608000,
          },
          {
            date: "2025-08-15",
            description: "Deposit to 'Future Crypto'",
            amount: -200000,
            balance: 408000,
          },
        ],
        culprit: true,
        solution:
          "Aisha created fake student profiles and approved their scholarships. She had the funds sent to friends, who then transferred the money to her under vague descriptions like 'Gift' to hide the trail.",
      },
      {
        name: "Arjun Verma",
        title: "Foundation CFO",
        description:
          "Signs off on the total scholarship budget annually, not individual recipients.",
        transactions: [
          {
            date: "2025-05-01",
            description: "Salary Deposit",
            amount: 500000,
            balance: 4500000,
          },
          {
            date: "2025-05-15",
            description: "Investment - Bonds",
            amount: -500000,
            balance: 4000000,
          },
          {
            date: "2025-06-01",
            description: "Salary Deposit",
            amount: 500000,
            balance: 4500000,
          },
          {
            date: "2025-06-15",
            description: "Art Auction Purchase",
            amount: -1500000,
            balance: 3000000,
          },
          {
            date: "2025-07-01",
            description: "Salary Deposit",
            amount: 500000,
            balance: 3500000,
          },
          {
            date: "2025-07-20",
            description: "Property Management Fees",
            amount: -100000,
            balance: 3400000,
          },
          {
            date: "2025-08-01",
            description: "Salary Deposit",
            amount: 500000,
            balance: 3900000,
          },
          {
            date: "2025-08-10",
            description: "Donation to Hospital",
            amount: -250000,
            balance: 3650000,
          },
        ],
        culprit: false,
        solution:
          "As the CFO, Arjun's financial dealings are significant and transparent. He operates at a budget level, making him an unlikely suspect for a scam involving multiple small transactions.",
      },
      {
        name: "Dr. Sharma",
        title: "University Administrator",
        description:
          "Promotes the scholarship at his university and provides a shortlist of genuine candidates.",
        transactions: [
          {
            date: "2025-06-05",
            description: "Salary Deposit",
            amount: 150000,
            balance: 750000,
          },
          {
            date: "2025-06-15",
            description: "Mortgage Payment",
            amount: -60000,
            balance: 690000,
          },
          {
            date: "2025-07-05",
            description: "Salary Deposit",
            amount: 150000,
            balance: 840000,
          },
          {
            date: "2025-07-10",
            description: "Academic Conference Travel",
            amount: -75000,
            balance: 765000,
          },
          {
            date: "2025-07-20",
            description: "Publishing Fees",
            amount: -25000,
            balance: 740000,
          },
          {
            date: "2025-08-05",
            description: "Salary Deposit",
            amount: 150000,
            balance: 890000,
          },
          {
            date: "2025-08-15",
            description: "Mortgage Payment",
            amount: -60000,
            balance: 830000,
          },
          {
            date: "2025-08-25",
            description: "Investment in Fixed Deposit",
            amount: -100000,
            balance: 730000,
          },
        ],
        culprit: false,
        solution:
          "Dr. Sharma's role is purely advisory. His financial records are consistent with that of a senior academic, showing no suspicious deposits.",
      },
    ],
    debriefing: {
      crime_type: "Grant & Expense Fraud",
      red_flags: [
        "Multiple, small, recurring deposits from non-payroll sources.",
        "Vague and suspicious descriptions for these deposits, such as 'Gift' or 'Loan Repayment,' which are common ways to disguise illicit funds.",
        "The accumulation of these small amounts into a large sum that is then moved into a high-risk, hard-to-trace asset like cryptocurrency.",
      ],
      prevention_individual:
        "Be transparent about your sources of income. Using vague descriptions for transfers can be a red flag during any financial review or audit.",
      prevention_business:
        "A robust beneficiary validation process is key. For grants or scholarships, this means verifying identities and documents with the source (e.g., the university). Also, **spot audits**, where a random sample of recipients are contacted directly to confirm they are legitimate, are a powerful deterrent.",
      financial_concept: "Due Diligence",
      concept_explanation:
        "This case is about the failure of Due Diligence. This is the process of taking reasonable steps to satisfy a legal requirement. In this context, the foundation failed to perform due diligence on its 'students,' allowing the fraud to occur. Thorough verification is not a corner that can be cut.",
    },
  },
];

function initializeGame() {
  loadCase(currentCaseIndex);
  updateProgress();
}
function loadCase(caseIndex) {
  const currentCase = cases[caseIndex];
  document.getElementById("case-id").textContent = currentCase.id;
  document.getElementById("case-intro").textContent = currentCase.intro;
  document.getElementById("case-victim").textContent = currentCase.victim;
  document.getElementById("case-amount").textContent = currentCase.amount;
  document.getElementById("case-timeframe").textContent = currentCase.timeframe;
  document.getElementById("case-location").textContent = currentCase.location;
  const suspectsContainer = document.getElementById("suspects-container");
  suspectsContainer.innerHTML = "";
  currentCase.suspects.forEach((suspect, index) => {
    const suspectEl = document.createElement("div");
    suspectEl.className = "suspect";
    suspectEl.innerHTML = `<div class="suspect-name">${suspect.name}</div><div class="suspect-title">${suspect.title}</div><div class="suspect-desc">${suspect.description}</div>`;
    suspectsContainer.appendChild(suspectEl);
  });
  setupSuspectSelection();
  currentSuspectIndex = 0;
  document.querySelectorAll(".suspect")[0].classList.add("selected");
  displayTransactions(0);
}
function displayTransactions(suspectIndex) {
  const transactionTable = document.getElementById("transaction-data");
  transactionTable.innerHTML = "";
  const currentCase = cases[currentCaseIndex];
  currentCase.suspects[suspectIndex].transactions.forEach((transaction) => {
    const row = document.createElement("tr");
    const isCredit = transaction.amount >= 0;
    row.className = isCredit ? "credit" : "debit";
    row.innerHTML = `<td>${transaction.date}</td><td>${
      transaction.description
    }</td><td>${isCredit ? "+" : ""}₹${Math.abs(
      transaction.amount
    ).toLocaleString("en-IN")}</td><td>₹${transaction.balance.toLocaleString(
      "en-IN"
    )}</td>`;
    transactionTable.appendChild(row);
  });
  document.getElementById("current-suspect").textContent =
    currentCase.suspects[suspectIndex].name;
}
function setupSuspectSelection() {
  const suspectElements = document.querySelectorAll(".suspect");
  suspectElements.forEach((element, index) => {
    element.addEventListener("click", () => {
      suspectElements.forEach((el) => el.classList.remove("selected"));
      element.classList.add("selected");
      currentSuspectIndex = index;
      displayTransactions(currentSuspectIndex);
    });
  });
}
function updateProgress() {
  document.getElementById("cases-solved").textContent = casesSolved;
  document.getElementById("accuracy").textContent =
    casesSolved > 0
      ? Math.round((correctAccusations / casesSolved) * 100) + "%"
      : "0%";
  document.getElementById("total-red-flags").textContent = totalRedFlagsFound;
}
function checkForRedFlags() {
  showModal(
    "Memo",
    "Review transaction descriptions for suspicious keywords and compare large expenditures against salary."
  );
}
function highlightLargeTransactions() {
  document.querySelectorAll("#transaction-data tr").forEach((row) => {
    row.classList.remove("highlight");
    const amountText = row.cells[2].textContent;
    const amount = parseFloat(amountText.replace(/[^\d.-]/g, ""));
    if (Math.abs(amount) > 100000) {
      row.classList.add("highlight");
    }
  });
  showModal(
    "Memo: Large Transactions",
    "Transactions over ₹1,00,000 have been marked in the ledger for review."
  );
}
function identifyUnknownParties() {
  document.querySelectorAll("#transaction-data tr").forEach((row) => {
    row.classList.remove("highlight");
    const description = row.cells[1].textContent.toLowerCase();
    if (
      description.includes("unknown") ||
      description.includes("digital solutions") ||
      description.includes("enterprises")
    ) {
      row.classList.add("highlight");
    }
  });
  showModal(
    "Memo: Questionable Parties",
    "Transactions with unknown or shell companies have been marked."
  );
}
function accuseSuspect() {
  const currentCase = cases[currentCaseIndex];
  showModal(
    "Final Accusation",
    "Who do you believe is responsible?",
    currentCase.suspects.map((suspect, index) => ({
      text: suspect.name,
      action: () => accuse(index),
    }))
  );
}
function accuse(suspectIndex) {
  closeModal();
  const currentCase = cases[currentCaseIndex];
  const suspect = currentCase.suspects[suspectIndex];
  const isCorrect = suspect.culprit;
  casesSolved++;

  if (isCorrect) {
    correctAccusations++;
    showAccusationResult(true, `CASE CLOSED - Correct`);
    showDebriefingReport(currentCaseIndex);
  } else {
    const nextCaseButton = {
      text: "Proceed to Next Case",
      action: resetGame,
    };
    showAccusationResult(false, `COLD CASE - Incorrect`);
    showModal(
      "Incorrect Accusation",
      `Incorrect. ${suspect.solution}<br><br>The trail has gone cold.`,
      [nextCaseButton]
    );
  }
  updateProgress();
}
function resetGame() {
  closeModal();
  currentCaseIndex = (currentCaseIndex + 1) % cases.length;
  loadCase(currentCaseIndex);
}
function showModal(title, message, buttons = []) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML = message;
  const modalButtons = document.getElementById("modalButtons");
  modalButtons.innerHTML = "";
  if (buttons.length === 0) {
    modalButtons.innerHTML =
      '<button class="button" onclick="closeModal()">Dismiss</button>';
  } else {
    buttons.forEach((button) => {
      const btn = document.createElement("button");
      btn.className = "button";
      btn.innerHTML = button.text;
      btn.onclick = button.action;
      modalButtons.appendChild(btn);
    });
  }
  document.getElementById("customModal").style.display = "flex";
}
function showDebriefingReport(caseIndex) {
  const currentCase = cases[caseIndex];
  const debrief = currentCase.debriefing;
  const culprit = currentCase.suspects.find((s) => s.culprit);

  const redFlagsHtml = debrief.red_flags
    .map((flag) => `<li>${flag}</li>`)
    .join("");

  const reportHtml = `
                <p>You correctly identified <strong>${culprit.name}</strong>. Here is the complete debriefing on this case.</p>
                
                <div class="debrief-section">
                    <h3 class="debrief-header">Crime Analysis: ${debrief.crime_type}</h3>
                    <p>${culprit.solution}</p>
                </div>

                <div class="debrief-section">
                    <h3 class="debrief-header">Key Evidence Trail (The Red Flags)</h3>
                    <ul>${redFlagsHtml}</ul>
                </div>

                <div class="debrief-section">
                    <h3 class="debrief-header">Prevention Protocol</h3>
                    <p><strong>For Individuals:</strong> ${debrief.prevention_individual}</p>
                    <p><strong>For Businesses:</strong> ${debrief.prevention_business}</p>
                </div>

                <div class="debrief-section">
                    <h3 class="debrief-header">Core Financial Concept: ${debrief.financial_concept}</h3>
                    <p>${debrief.concept_explanation}</p>
                </div>
            `;

  showModal(`DEBRIEFING REPORT: CASE #${currentCase.id}`, reportHtml, [
    { text: "Proceed to Next Case", action: resetGame },
  ]);
}
function closeModal() {
  document.getElementById("customModal").style.display = "none";
}
function showAccusationResult(isCorrect, message) {
  const resultElement = document.getElementById("accusation-result");
  resultElement.style.display = "block";
  resultElement.innerHTML = message;
  resultElement.className = isCorrect
    ? "accusation-result correct"
    : "accusation-result incorrect";
  setTimeout(() => {
    resultElement.style.display = "none";
  }, 4000);
}
window.onload = initializeGame;
