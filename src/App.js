/**
 * @file StudyApp.jsx
 * @description Interactive study tool for Carleton University BUSI 1001 (Contemporary Business).
 *
 * Features:
 *  - Chapter-by-chapter notes viewer with section navigation
 *  - Flashcard mode (tap to flip term → definition)
 *  - Per-chapter quick quiz (10 MCQ, instant feedback)
 *  - Full 100-question randomized midterm exam with Carleton-style grading
 *  - Global search across all terms and definitions
 *
 * Chapters covered: 1, 2, 3, 4, 5, 6, 16, 18
 *
 * @author Aaditya Virk
 * @license MIT
 */

import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Accent colours assigned to each chapter in order.
 * Used for headers, pills, progress bars, and card borders.
 */
const COLORS = ["#e85d04","#2d6a4f","#7209b7","#0077b6","#c77dff","#f77f00","#e63946","#06a77d"];

// ─────────────────────────────────────────────────────────────────────────────
// COURSE DATA
// Each chapter object contains:
//   num      {number}   Chapter number (matches the textbook)
//   title    {string}   Chapter title
//   emoji    {string}   Decorative emoji used in the UI
//   sections {Array}    Study notes broken into headed sections, each with
//                       bullet-point strings
//   terms    {Array}    [term, definition] pairs used for flashcards, quizzes,
//                       and the midterm exam
// ─────────────────────────────────────────────────────────────────────────────

const chapters = [
  {
    num: 1, title: "The Changing Face of Business", emoji: "🏢",
    sections: [
      { heading: "What is Business?", bullets: [
        "Business = all profit-seeking activities and enterprises that provide goods and services necessary to an economic system",
        "Profits = rewards for businesspeople who take risks offering goods/services to customers",
        "Without profits, a company cannot survive — profit is the central engine",
        "Not-for-profit organizations: businesslike establishments with primary goals OTHER than returning profits",
        "Examples: Canadian Red Cross, Canadian SPCA — operate in both private and public sectors",
        "98% of Canadian firms are small businesses with fewer than 500 employees",
        "Small businesses create 80% of all new jobs and generate 45% of Canada's economic output",
      ]},
      { heading: "Factors of Production", bullets: [
        "Every economic system needs four basic inputs — the factors of production:",
        "1. NATURAL RESOURCES: inputs useful in their natural state (land, minerals, forests)",
        "2. CAPITAL: technology, machinery, tools, information, physical facilities",
        "3. HUMAN RESOURCES: anyone who works — physical labour + intellectual effort",
        "4. ENTREPRENEURSHIP: the willingness to take risks to create and operate a business",
        "Managing ALL four factors is critical for successful business operation",
        "Each factor earns a payment: land → rent | capital → interest | labour → wages | entrepreneurship → profit",
      ]},
      { heading: "Private Enterprise & Capitalism", bullets: [
        "Capitalism: economic system where businesses meet consumer needs and are rewarded through profit",
        "Adam Smith first described capitalism in The Wealth of Nations — coined the 'invisible hand'",
        "Invisible hand: competition regulates economic life without government intervention",
        "Private enterprise minimizes government interference in economic activity",
        "Firms rewarded for their ability to compete and satisfy consumer needs",
        "Competitive differentiation: unique combination of abilities, products, and approaches that sets a firm apart",
        "Four rights in a private enterprise system: private property, freedom of choice, profits, competition",
      ]},
      { heading: "Seven Eras in Business History", bullets: [
        "1. COLONIAL PERIOD (pre-1776): primarily agricultural; subsistence-level economy",
        "2. INDUSTRIAL REVOLUTION (1760–1850): mass production by semi-skilled workers aided by machines",
        "3. AGE OF INDUSTRIAL ENTREPRENEURS (late 1800s): advances in tech + demand for manufactured goods",
        "4. PRODUCTION ERA (through 1920s): assembly lines; emphasis on producing MORE faster",
        "5. MARKETING ERA (since 1950s): consumer orientation — understand and satisfy customer needs",
        "6. RELATIONSHIP ERA (began 1990s): deep ongoing links with customers, employees, and suppliers",
        "7. SOCIAL ERA (since 2004): virtual communities, networks, global interaction and sharing",
        "Key shift: Production Era = make as much as possible → Marketing Era = satisfy consumer needs",
      ]},
      { heading: "Current Trends & Today's Manager", bullets: [
        "Aging population: Baby Boomers retiring; Generations X and Y building careers; widening age spectrum",
        "Increasingly diverse workforce: two-thirds of Canada's population growth from international immigration",
        "COVID-19: accelerated digital tech adoption, remote work, changed work attitudes and networks",
        "Outsourcing: using outside vendors for functions previously handled in-house — internet made this easier",
        "TODAY'S MANAGER NEEDS THREE SKILLS:",
        "1. Vision: perceive marketplace needs and what the org must do to satisfy them",
        "2. Critical thinking & creativity: analyze info, pinpoint problems, develop novel solutions",
        "3. Ability to lead change: guide employees through turbulence — internal AND external forces",
        "Admired companies: solid profits, stable growth, safe environment, high-quality goods, ethics & CSR",
      ]},
    ],
    terms: [
      ["Business","All profit-seeking activities and enterprises providing goods/services to an economic system"],
      ["Profits","Rewards for businesspeople who take the risks of offering goods and services to customers"],
      ["Factors of production","Natural resources, Capital, Human resources, Entrepreneurship — the four inputs every economy needs"],
      ["Capitalism","Private enterprise system; minimal govt intervention; competition (invisible hand) regulates economy"],
      ["Competitive differentiation","Unique combination of abilities, products, and approaches that sets a firm apart from competitors"],
      ["Invisible hand","Adam Smith's concept: competition naturally regulates economic life without government direction"],
      ["Vision","Ability to perceive marketplace needs and what an organization must do to satisfy them"],
      ["Critical thinking","Ability to analyze and assess information to pinpoint problems or opportunities"],
      ["Creativity","Capacity to develop novel solutions to perceived organizational problems"],
      ["Outsourcing","Using outside vendors to produce goods or fulfill functions previously handled in-house"],
      ["Relationship management","Activities that build and maintain ongoing, mutually beneficial ties with customers and others"],
    ]
  },
  {
    num: 2, title: "Economic Challenges Facing Business", emoji: "📈",
    sections: [
      { heading: "Micro vs. Macro Economics", bullets: [
        "MICROECONOMICS: study of small economic units — individual consumers, families, and businesses",
        "MACROECONOMICS: study of a nation's overall economic issues and how government policies affect citizens",
        "Economics: social science analyzing choices people and governments make in allocating SCARCE resources",
        "Demand: willingness AND ability of buyers to purchase goods and services",
        "Supply: willingness AND ability of sellers to provide goods and services",
        "Both micro and macro provide different lenses on the same economy — micro impacts macro and vice versa",
      ]},
      { heading: "Demand, Supply & Equilibrium", bullets: [
        "Demand curve: slopes DOWNWARD — as price rises, quantity demanded falls (inverse relationship)",
        "Demand SHIFTS RIGHT if: income rises, buyer preferences increase, number of buyers rises, substitute prices rise, optimistic expectations",
        "Demand SHIFTS LEFT if: opposite of above",
        "Supply curve: slopes UPWARD — as price rises, quantity supplied rises",
        "Supply SHIFTS RIGHT if: input costs fall, technology costs fall, taxes fall, number of suppliers rises",
        "EQUILIBRIUM PRICE: where supply and demand curves intersect — the current market-clearing price",
        "Key: movement ALONG curve = price change | SHIFT of curve = change in non-price factor",
      ]},
      { heading: "Four Types of Competition", bullets: [
        "PURE COMPETITION: many competitors, similar products, NO price control — e.g., Ontario small farmers",
        "MONOPOLISTIC COMPETITION: many competitors, DIFFERENTIATED products, some price control — e.g., gyms",
        "OLIGOPOLY: FEW competitors, high start-up costs as barriers to entry — e.g., Bell and Rogers telecom",
        "MONOPOLY: single seller, NO direct competition, considerable price control — most are regulated",
        "Pure monopolies are ILLEGAL in Canada under the Competition Act",
        "Most likely to be regulated = Monopoly (government intervenes to control prices)",
        "Canada's economy is capitalist but with SOME government intervention (e.g., monopoly regulation)",
      ]},
      { heading: "Economic Systems & Business Cycle", bullets: [
        "CAPITALISM (private enterprise): market-driven, profit motive, hands-off government",
        "SOCIALISM: government owns MAJOR industries; some private ownership allowed (retail, some manufacturing)",
        "COMMUNISM: all property shared equally under a strong central government; Karl Marx basis",
        "MIXED MARKET ECONOMY: draws from both; Canada has mixed (healthcare, education = government-run)",
        "Privatization: converting govt-owned companies to privately-held businesses",
        "BUSINESS CYCLE STAGES:",
        "1. Prosperity: low unemployment, high consumer confidence, businesses expanding",
        "2. Recession: economic contraction for 6+ months; consumers cautious, businesses slow production",
        "3. Depression: extended recession; basic goods difficult to find",
        "4. Recovery: declining unemployment, renewed consumer confidence, increasing activity",
      ]},
      { heading: "GDP, Inflation & Managing the Economy", bullets: [
        "GDP (Gross Domestic Product): sum of all goods and services produced within a country in a given year",
        "Productivity: Output / Input — total productivity of businesses = measure of economic strength",
        "INFLATION: rising prices from excessive consumer demand AND/OR higher production costs",
        "Demand-pull inflation: excessive consumer demand drives prices up",
        "Cost-push inflation: increases in factors of production raise prices",
        "Core inflation rate: inflation AFTER removing food and energy prices (too volatile)",
        "CPI (Consumer Price Index): monthly average change in prices of a market basket",
        "CPI basket: Shelter 29.8% | Food 16.4% | Transportation 15.3% | Household 15.2% | Recreation 9.5%",
        "MONETARY POLICY (Bank of Canada): change money supply and interest rates to influence growth",
        "Expansionary: increase money supply → lower borrowing costs → more investment",
        "Restrictive: decrease money supply → control inflation and overexpansion",
        "FISCAL POLICY: government spending and taxation decisions",
        "Budget deficit: govt spends MORE than it raises → borrows → increases national debt",
        "4 UNEMPLOYMENT TYPES: Frictional (job-searching), Structural (skills mismatch), Cyclical (recession), Seasonal (off-season)",
      ]},
    ],
    terms: [
      ["Microeconomics","Study of small economic units — individual consumers, families, and businesses"],
      ["Macroeconomics","Study of a nation's overall economic issues and how government policies affect citizens' standard of living"],
      ["Demand","Willingness and ability of buyers to purchase goods and services"],
      ["Supply","Willingness and ability of sellers to provide goods and services"],
      ["Equilibrium price","Price at which supply and demand curves meet — the current market-clearing price"],
      ["GDP","Gross Domestic Product — sum of all goods/services produced within a country in a given year"],
      ["Productivity","Output divided by input — a key measure of economic strength"],
      ["Inflation","Rising prices caused by excessive consumer demand and/or higher production costs"],
      ["Core inflation rate","Inflation after removing food and energy prices"],
      ["CPI","Consumer Price Index — monthly average change in prices of a representative market basket"],
      ["Monetary policy","Govt plan to change money supply and interest rates to affect growth and borrowing"],
      ["Fiscal policy","Government spending and taxation decisions to control inflation and encourage growth"],
      ["Budget deficit","When government spends more than it raises — adds to national debt"],
      ["Privatization","Conversion of government-owned companies to privately-held businesses"],
      ["Frictional unemployment","Temporarily not working but actively job searching (e.g., new graduates)"],
      ["Structural unemployment","Skills no longer in demand — unemployed long-term (e.g., replaced by robots)"],
      ["Cyclical unemployment","Out of work due to temporary economic downturn / recession"],
    ]
  },
  {
    num: 3, title: "International Business", emoji: "🌍",
    sections: [
      { heading: "Why Nations Trade", bullets: [
        "Trade boosts economic growth, expands markets, and enables more efficient production",
        "Reduces dependence on the domestic economy — diversifies risk",
        "Exports: domestically produced goods SOLD in other countries",
        "Imports: foreign-made products PURCHASED by domestic consumers",
        "Decisions to operate abroad depend on availability, price, and quality of: labour, natural resources, capital, entrepreneurship",
        "Developing nations expanding into global marketplace creates growing opportunities",
        "India averaged 7.5% GDP growth; China previously exceeded double-digit growth rates",
      ]},
      { heading: "Absolute vs. Comparative Advantage", bullets: [
        "ABSOLUTE ADVANTAGE: a country can produce a product cheaper than ANY other country, OR maintains a monopoly",
        "Example: China's domination of silk production for centuries",
        "Example: Spain's near-absolute advantage in saffron — thrives in Spain's specific climate and soil",
        "COMPARATIVE ADVANTAGE: a nation supplies its products more efficiently relative to other goods it could produce",
        "Example: India's combination of educated workforce + low wages in software development",
        "Absolute advantages are RARE in modern times — comparative advantage drives most trade",
        "Climate differences, technological advantages, and workforce skills all create comparative advantages",
      ]},
      { heading: "Measuring International Trade", bullets: [
        "Balance of trade: difference between a nation's EXPORTS and IMPORTS",
        "Trade surplus: exports > imports | Trade deficit: imports > exports",
        "Canada 2020: trade deficit increased to nearly $45 billion",
        "Balance of payments: OVERALL money flows into/out of a country (trade + investments + loans + aid)",
        "Balance-of-payments surplus: MORE money into a country than out",
        "Balance-of-payments deficit: MORE money out of a country than in",
        "EXCHANGE RATE: value of one nation's currency compared with currencies of other nations",
        "Exchange rates float (supply & demand); governments can DEVALUE currency to increase exports",
        "Devaluation: deliberate drop in currency value — makes exports cheaper, stimulates foreign investment",
      ]},
      { heading: "Barriers to International Trade", bullets: [
        "SOCIAL & CULTURAL BARRIERS: language (mistranslation, inappropriate messaging), values, religious practices",
        "ECONOMIC BARRIERS: poor infrastructure (roads, internet), currency conversion challenges",
        "POLITICAL & LEGAL BARRIERS: stability, Canadian law, international regulations, corruption climate",
        "TARIFFS: taxes/surcharges on foreign products — revenue tariffs vs. protective tariffs",
        "QUOTAS: limits on amounts of particular products that can be imported in a time period",
        "DUMPING: selling products abroad BELOW production costs or below home-market prices",
        "EMBARGO: total ban on importing a product OR trading with a particular country",
        "Nontariff barriers: also include exchange controls and administrative trade barriers",
        "Canada's CFPOA: makes it illegal to bribe foreign officials (similar to US FCPA)",
      ]},
      { heading: "Reducing Barriers & Going Global", bullets: [
        "GATT (1947) → succeeded by WTO (1995) with 159 member countries; mediates trade disputes",
        "World Bank: funds infrastructure projects in developing countries",
        "IMF: lender to troubled nations to promote trade and stability",
        "CUSMA: replaced NAFTA in 2018 — world's largest free-trade zone between Canada, US, Mexico",
        "EU: 27 members (UK exited 2020); promotes economic and social progress",
        "THREE LEVELS OF INTERNATIONAL INVOLVEMENT (lowest to highest risk/return):",
        "1. Exporting/Importing — least risk, least control",
        "2. Contract-based agreements — franchising, licensing, subcontracting",
        "3. Direct investment — acquisitions, joint ventures, overseas divisions",
        "GLOBAL strategy: same product, same approach worldwide",
        "MULTIDOMESTIC strategy: adapted to each country's culture, tastes, and buying habits (e.g., McDonald's)",
      ]},
    ],
    terms: [
      ["Exports","Domestically produced goods sold in other countries"],
      ["Imports","Foreign-made products purchased by domestic consumers"],
      ["Absolute advantage","A country can produce a product cheaper than any other, or maintains a monopoly on it"],
      ["Comparative advantage","A nation can supply products more efficiently relative to other goods it could produce"],
      ["Balance of trade","Difference between a nation's exports and imports"],
      ["Balance of payments","Overall money flows into or out of a country (trade + investments + loans + aid)"],
      ["Exchange rate","Value of one nation's currency compared with currencies of other nations"],
      ["Devaluation","Deliberate drop in currency value to make exports cheaper and attract foreign investment"],
      ["Tariff","Tax, surcharge, or duty on foreign products"],
      ["Quota","Limits the amount of a particular product that can be imported in a given period"],
      ["Dumping","Selling products in foreign markets below production cost or below home-market prices"],
      ["Embargo","Total ban on importing a product or trading with a particular country"],
      ["CUSMA","Canada-United States-Mexico Agreement — replaced NAFTA in 2018; world's largest free-trade zone"],
      ["WTO","World Trade Organization — succeeded GATT in 1995; 159 members; mediates trade disputes"],
      ["Countertrade","Trade where payment is made in local products, not currency"],
      ["Multinational corporation","Organization with significant foreign operations"],
      ["Global strategy","Selling essentially the same product in the same manner worldwide"],
      ["Multidomestic strategy","Treating each national market differently; adapting to local customs and tastes"],
    ]
  },
  {
    num: 4, title: "Business Ethics & Social Responsibility", emoji: "⚖️",
    sections: [
      { heading: "Ethics & the Contemporary Environment", bullets: [
        "Business ethics: standards of conduct and moral values guiding actions and decisions at work",
        "CSR (Corporate Social Responsibility): management's obligation to consider societal well-being alongside profit",
        "Vast majority of businesses ARE ethical — but high-profile cases put ethics in the spotlight",
        "Sarbanes-Oxley Act (US, 2002): new rules for securities trading and accounting — applies to Canadian firms on US exchanges",
        "C-SOX / Bill 198 (Canada, 2003): Canadian equivalent — senior executives must personally certify financial info",
        "Three approaches businesses use: corporate philanthropy, risk management, and creating value by 'doing right'",
        "Individuals shape ethics: lying to employees, misrepresenting hours, abusing internet, violating safety regs",
      ]},
      { heading: "On-the-Job Ethical Dilemmas", bullets: [
        "Individual ethics shaped by: experiences, family, educational, cultural, and religious backgrounds",
        "Company environment ALSO shapes ethical behaviour — culture matters enormously",
        "FOUR COMMON ETHICAL DILEMMAS:",
        "1. Conflict of interest: personal interests interfere with professional responsibilities/decision-making",
        "2. Honesty and integrity: lying to employees, customers, or misrepresenting work",
        "3. Loyalty vs. truth: protecting the company vs. reporting wrongdoing",
        "4. Whistle-blowing: reporting misconduct at personal career risk",
        "A firm's ethical behaviour depends on executives, employees, AND organizational climate — ALL three matter",
      ]},
      { heading: "4-Level Ethical Conduct Model", bullets: [
        "If ANY of the four levels is missing, the ethical climate in an organization weakens",
        "LEVEL 1 — ETHICAL AWARENESS: Code of Conduct",
        "Formal statement defining how the org expects employees to resolve ethical questions",
        "Examples: Johnson & Johnson Credo, Air Canada Code of Conduct",
        "LEVEL 2 — ETHICAL EDUCATION: training in ethical reasoning",
        "Codes of conduct can't cover every situation — training lets employees PRACTICE applying ethics",
        "LEVEL 3 — ETHICAL ACTION: turning reasoning into real decisions",
        "TI Ethics Quick Test — employees recognize AND act on ethical problems",
        "LEVEL 4 — ETHICAL LEADERSHIP: executives model ethical behaviour in their OWN actions",
        "Ethical leadership charges EVERY employee at every level with being an ethical leader",
      ]},
      { heading: "Social Responsibility — 4 Areas", bullets: [
        "Social responsibility: management's acceptance of obligation to consider profit AS EQUAL TO other qualitative indicators",
        "FOUR AREAS OF RESPONSIBILITY:",
        "1. TO THE GENERAL PUBLIC: public health (alcohol, tobacco, obesity), environmental protection, workforce quality, corporate philanthropy",
        "Green marketing: strategy promoting environmentally safe products and production methods",
        "Sustainability: finding renewable sources of clean energy",
        "2. TO CUSTOMERS: Right to be Safe | Right to be Informed | Right to Choose | Right to be Heard",
        "Consumerism: public demand that businesses consider consumer wants and needs in decisions",
        "3. TO EMPLOYEES: workplace safety (WSIB Ontario), quality-of-life issues (flex schedules, childcare), equal opportunity, no harassment",
        "4. TO INVESTORS: earn profits, behave ethically/legally; regulated by OSC and ASC",
        "Companies measure social performance through social audits",
      ]},
    ],
    terms: [
      ["Business ethics","Standards of conduct and moral values guiding actions and decisions in the business environment"],
      ["CSR","Corporate Social Responsibility — management's obligation to consider societal well-being alongside profit"],
      ["Sarbanes-Oxley Act","US 2002 law establishing stricter rules for securities trading and accounting practices"],
      ["C-SOX / Bill 198","Canada's 2003 equivalent of Sarbanes-Oxley"],
      ["Code of Conduct","Formal statement defining how the organization expects employees to resolve ethical questions"],
      ["Conflict of interest","When personal interests interfere with professional responsibilities"],
      ["Whistle-blowing","Reporting unethical or illegal activity within an organization, often at personal career risk"],
      ["Green marketing","Strategy promoting environmentally safe products and production methods"],
      ["Sustainability","Finding renewable sources of clean energy and managing resources responsibly"],
      ["Corporate philanthropy","Cash contributions, product donations, and support for employee volunteer efforts"],
      ["Social audit","Tool to measure a firm's social performance across all stakeholder groups"],
      ["Consumerism","Public demand that businesses consider consumer wants and needs in their decisions"],
    ]
  },
  {
    num: 5, title: "Small Business & Business Ownership", emoji: "🏪",
    sections: [
      { heading: "Small Business in Canada", bullets: [
        "Industry Canada definition: <100 employees, not dominant in its market, revenue under $2 million",
        "~98% of Canadian firms have fewer than 100 employees",
        "Canada has ~2.8 million self-employed individuals",
        "Small/medium businesses account for 89.5% of total PRIVATE SECTOR employment (2018)",
        "Concentrated in: retail, construction, professional/scientific/technical services, healthcare",
        "Home-based businesses: more control, lower startup costs — but isolation and less visibility",
        "Small businesses are a launching pad for entrepreneurs and the foundation of innovation",
      ]},
      { heading: "Why Small Businesses Fail", bullets: [
        "~4% close after 1 year | ~15% close within 3 years | ~30% fail within 5 years",
        "REASON 1 — MANAGEMENT SHORTCOMINGS:",
        "Inexperience, overconfidence in abilities, lack of people skills, poor financial knowledge",
        "Misjudging competition, taking on too many functions → bad decisions",
        "REASON 2 — INADEQUATE FINANCING:",
        "Often underestimate start-up costs; don't turn a profit for months or years",
        "Makes management shortcomings worse — can't attract/keep talented people",
        "REASON 3 — GOVERNMENT REGULATION:",
        "Small businesses spend billions on regulatory compliance; fewer staff to handle it",
        "Taxes: provincial/federal income tax, workers' compensation, pension, unemployment benefits",
      ]},
      { heading: "Business Plan & Assistance", bullets: [
        "Business plan: written documentation detailing company goals, methods, and performance standards",
        "Creates a framework, identifies mission/vision, analyzes advantage, customers, competition, and risks",
        "BDC (Business Development Bank of Canada): assists, counsels, and protects small business interests",
        "CSBFP (Canada Small Business Financing Program): govt guarantees 85% of bank loan if unpaid",
        "Business incubators: low-cost shared facilities to help start-up companies develop; 1,250+ in North America",
        "Venture capital: money invested in small business in exchange for an ownership share",
        "Angel investors (via Dragon's Den!): wealthy individuals investing directly for equity",
        "~50% of Canadian SMEs have at least one female owner; rate of women's entrepreneurship growing",
      ]},
      { heading: "Forms of Business Ownership", bullets: [
        "SOLE PROPRIETORSHIP: single owner; owner's legal identity NOT separate from business; unlimited personal liability",
        "PARTNERSHIP: two or more co-owners by voluntary legal agreement; usually unlimited personal liability",
        "CORPORATION: legal organization separate from owners; limited liability; taxed separately",
        "Preferred shares: limited voting rights but priority claim on dividends",
        "Common shares: voting rights but only RESIDUAL (last) claim on assets",
        "Board of Directors: governing body elected by shareholders to oversee corporation",
        "Not-for-profit corporations: goals other than profit (e.g., Red Cross, SPCA)",
        "Public ownership: government owns and operates (e.g., Manitoba Hydro, TTC)",
        "Cooperative ownership: owners work together to operate activities (e.g., Vancity, MEC)",
      ]},
      { heading: "Franchising & Mergers", bullets: [
        "Franchise: contract giving franchisee right to produce/sell using franchisor's brand and business model",
        "Canada = world's 2nd largest franchise industry (after US); ~45% of ALL Canadian sales",
        "~1,200–1,300 franchise companies; ~76,000 outlets; 1.5 million employees",
        "FRANCHISE ADVANTAGES: proven brand, prior performance record, tested management, volume purchasing savings",
        "FRANCHISE DISADVANTAGES: fees, royalties, linked to franchisor reputation, tight control, restrictions",
        "McDonald's startup costs: $1.1M–$2.2M",
        "MERGER TYPES: Vertical (different production levels) | Horizontal (same industry) | Conglomerate (unrelated)",
        "Acquisition: one firm purchases another — takes on its assets AND debts",
        "Joint venture: partnership for a SPECIFIC activity; shares costs, risks, profits, and management",
      ]},
    ],
    terms: [
      ["Small business (Industry Canada)","<100 employees, not dominant in market, revenue under $2 million"],
      ["Sole proprietorship","Single-owner business; unlimited personal liability; owner and business legally identical"],
      ["Partnership","Two or more co-owners operating by voluntary legal agreement"],
      ["Corporation","Legal entity separate from owners; owners have limited liability; taxed separately"],
      ["Preferred shares","Limited voting rights but priority claim on dividends"],
      ["Common shares","Voting rights but only residual (last) claim on firm assets"],
      ["Franchise","Contract giving franchisee right to use franchisor's brand and business model"],
      ["Franchisee","The individual or firm that buys and operates the franchise"],
      ["Franchisor","The firm whose products/brand are sold by the franchisee"],
      ["BDC","Business Development Bank of Canada — assists, counsels, protects small businesses"],
      ["CSBFP","Canada Small Business Financing Program — government guarantees 85% of bank loans to small businesses"],
      ["Business incubator","Low-cost shared facility that helps start-ups develop and grow before operating independently"],
      ["Venture capital","Money invested in small business by a group in exchange for an ownership share"],
      ["Vertical merger","Combines firms at DIFFERENT levels of production (e.g., manufacturer + supplier)"],
      ["Horizontal merger","Joins firms in the SAME industry"],
      ["Conglomerate merger","Combines UNRELATED firms"],
      ["Joint venture","Partnership between companies for a specific activity; shares costs, risks, and profits"],
    ]
  },
  {
    num: 6, title: "Entrepreneurship & Starting a Business", emoji: "🚀",
    sections: [
      { heading: "What is an Entrepreneur?", bullets: [
        "Entrepreneur: risk taker in the private enterprise system who seeks a profitable opportunity and sets up a business",
        "Key difference from managers: entrepreneurs assume PERSONAL risk (financial, social, career) and focus on GROWTH",
        "Key difference from small-business owners: one of their MAJOR goals is expansion",
        "On average: ~96,580 new businesses created each year in Canada",
        "3.5 million Canadians are starting or running new businesses",
        "42% of millennials consider entrepreneurship a career option",
        "THREE CATEGORIES: Classic (pursues opportunities), Serial (multiple businesses), Social (solves society's challenges)",
      ]},
      { heading: "Why People Choose Entrepreneurship", bullets: [
        "FOUR REASONS PEOPLE BECOME ENTREPRENEURS:",
        "1. Being your own boss: self-management and independence drive many entrepreneurs",
        "2. Financial success: entrepreneurs are wealth creators — start ventures to reap financial rewards",
        "3. Job security: large companies keep eliminating jobs → entrepreneurs create their OWN security",
        "4. Quality of life: flexibility, independence, control over WHEN, WHERE, and HOW to work",
        "Lifestyle entrepreneur: starts business to reduce work hours and gain a more relaxed lifestyle",
        "Key clarification: quality of life doesn't mean working LESS — it means working on YOUR terms",
        "Entrepreneurship is growing worldwide — not just a North American phenomenon",
      ]},
      { heading: "8 Traits of Successful Entrepreneurs", bullets: [
        "1. VISION: overall idea for how to make the business a success",
        "2. HIGH ENERGY LEVEL: work long and hard to make their visions a reality",
        "3. NEED TO ACHIEVE: strong competitive drive; enjoy reaching difficult goals",
        "4. SELF-CONFIDENCE & OPTIMISM: believe in their ability to succeed; instill optimism in others",
        "5. TOLERANCE FOR FAILURE: view setbacks as learning experiences; succeed through persistence",
        "6. CREATIVITY: think of new ideas for goods/services and new ways to overcome problems",
        "7. TOLERANCE FOR AMBIGUITY: take business uncertainties in stride — unexpected events are the norm",
        "8. INTERNAL LOCUS OF CONTROL: believe they control their own future",
        "Most successful entrepreneurs often have parents who were entrepreneurs or wanted to be",
      ]},
      { heading: "Starting a Venture & Intrapreneurship", bullets: [
        "Selecting a business idea: (1) find what you love and are good at, AND (2) find a marketplace need",
        "Business plan: written goals + methods + standards; essential for funding; forces realistic planning",
        "Seed capital: initial funds to launch a new company",
        "FINANCING OPTIONS:",
        "Debt financing: borrowed money that MUST be repaid (credit cards, family/friends, bank loans)",
        "Equity financing: selling ownership stake (venture capitalists, angel investors)",
        "Angel investors: focus more on STARTUPS; invest personally for equity",
        "Venture capitalists: investment firms; usually invest in later-stage, high-growth tech companies",
        "INTRAPRENEURSHIP: promoting innovation WITHIN an existing organization's structure",
        "Skunkworks: employee-initiated project — employee convinces management, recruits internal resources",
        "Pacing programs: company-initiated projects focusing on products with potential for success",
      ]},
    ],
    terms: [
      ["Entrepreneur","Risk taker seeking profitable opportunity; sets up business; focused on growth and expansion"],
      ["Classic entrepreneur","Identifies a business opportunity, allocates resources, and pursues it"],
      ["Serial entrepreneur","Starts one business, runs it, then starts and runs additional businesses in succession"],
      ["Social entrepreneur","Focuses on solving society's challenges through the creation of a business"],
      ["Lifestyle entrepreneur","Starts a business to gain flexibility in work hours and control over lifestyle"],
      ["Internal locus of control","Belief that you control your own future — a key entrepreneurial trait"],
      ["Seed capital","Initial funds used to launch a new company"],
      ["Debt financing","Borrowed money that must be repaid (loans, credit cards, family/friends)"],
      ["Equity financing","Selling an ownership stake in the business to raise funds"],
      ["Venture capital","Funds invested by a group in early-stage, high-potential companies for equity"],
      ["Angel investor","Wealthy individual investing directly in a new venture for an equity stake"],
      ["Intrapreneurship","Promoting innovation within the structure of an existing organization"],
      ["Skunkworks","Employee-initiated project: employee convinces management and recruits internal resources to develop it"],
      ["Enterprise zone","Geographic area set aside for economic renewal with tax advantages to attract businesses"],
      ["Urban reserve","Economic zone within a municipality set aside as First Nations land for Indigenous commercial ventures"],
    ]
  },
  {
    num: 16, title: "Accounting & Financial Statements", emoji: "📒",
    sections: [
      { heading: "Accounting Fundamentals", bullets: [
        "Accounting: measuring, interpreting, and communicating financial information for informed business decisions",
        "Used by: owners, investors, lenders, management, employees, govt agencies — each for different purposes",
        "Open-book management: sharing sensitive financial info with employees and teaching them to understand it",
        "THREE BUSINESS ACTIVITIES INVOLVING ACCOUNTING:",
        "1. Financing activities: provide funds to start and expand the business",
        "2. Investing activities: acquire assets needed to run the business",
        "3. Operating activities: sell goods/services and manage expenses",
        "GAAP: Generally Accepted Accounting Principles — guidelines for acceptable accounting practices in Canada",
        "IFRS: International Financial Reporting Standards — REQUIRED for Canadian public companies; enables global comparisons",
      ]},
      { heading: "Accounting Equation & Cycle", bullets: [
        "ACCOUNTING EQUATION: Assets = Liabilities + Owners' Equity",
        "Asset: anything with future benefit owned or controlled by a business (cash, inventory, equipment, land)",
        "Liability: anything owed to creditors (accounts payable, notes payable, long-term debt, accrued wages)",
        "Owners' equity: owner's initial investment + retained profits; also called shareholders' equity",
        "Double-entry bookkeeping: EVERY transaction has two or more balanced effects — equation ALWAYS balances",
        "ACCOUNTING CYCLE: Basic Data → Record (journals) → Classify (ledger) → Summarize → Financial Statements",
        "Accrual accounting: records revenue and expenses when they OCCUR, not when cash actually changes hands",
      ]},
      { heading: "Four Financial Statements", bullets: [
        "1. BALANCE SHEET: snapshot of assets, liabilities, and equity at ONE specific date",
        "Current assets: cash and assets convertible to cash within 1 year",
        "Plant/property/equipment (net): physical assets lasting >1 year, shown net of depreciation",
        "Current liabilities: claims due within 1 year | Long-term debt: due 1+ years later",
        "Balance sheet MUST balance: Total Assets = Total Liabilities + Shareholders' Equity",
        "2. INCOME STATEMENT: revenues, expenses, and net income OVER a time period — the 'video'",
        "Sales → COGS → Gross Profit → Operating Expenses → Operating Profit → Depreciation → Interest → EBT → Tax → NET INCOME",
        "3. STATEMENT OF CHANGES IN EQUITY: begins with prior year equity; adds net income; subtracts dividends",
        "4. STATEMENT OF CASH FLOWS: cash receipts and payments from operating, investing, and financing activities",
      ]},
      { heading: "Financial Ratios", bullets: [
        "LIQUIDITY RATIOS — can the firm pay short-term obligations?",
        "Current ratio = Current Assets / Current Liabilities (2:1 is satisfactory)",
        "Acid-test (quick) ratio = (Current Assets − Inventory) / Current Liabilities (stricter measure)",
        "ACTIVITY RATIOS — how effectively is management using resources?",
        "Inventory turnover = Cost of Goods Sold / Average Inventory (higher = moves faster)",
        "Total asset turnover = Sales / Average Total Assets (higher = more efficient use of assets)",
        "LEVERAGE RATIOS — how much does the firm rely on debt?",
        "Debt ratio = Total Liabilities / Total Assets (>50% = firm relies more on debt than equity)",
        "PROFITABILITY RATIOS — how well does the firm generate profit?",
        "Net profit margin = Net Income / Sales (industry average ~5%)",
        "Return on equity (ROE) = Net Income / Average Owners' Equity",
      ]},
    ],
    terms: [
      ["Accounting","Measuring, interpreting, and communicating financial information for informed decision-making"],
      ["GAAP","Generally Accepted Accounting Principles — rules and conventions for acceptable accounting practices in Canada"],
      ["IFRS","International Financial Reporting Standards — required for Canadian public companies; enables global comparisons"],
      ["Accounting equation","Assets = Liabilities + Owners' Equity — must always balance"],
      ["Double-entry bookkeeping","Every transaction has two or more balanced effects on accounts"],
      ["Asset","Anything with future benefit owned or controlled by a business"],
      ["Liability","Anything owed to creditors"],
      ["Owners' equity","Owner's initial investment plus retained profits"],
      ["Accrual accounting","Records revenue and expenses when they occur, not when cash actually changes hands"],
      ["Balance sheet","Snapshot of assets, liabilities, and equity at a specific date — the 'photograph'"],
      ["Income statement","Records revenues, expenses, and net income over a time period — the 'video'"],
      ["Statement of cash flows","Shows cash receipts and payments from operating, investing, and financing activities"],
      ["Current ratio","Current Assets / Current Liabilities — measures ability to pay short-term obligations"],
      ["Acid-test ratio","(Current Assets − Inventory) / Current Liabilities — stricter liquidity measure"],
      ["Inventory turnover","Cost of Goods Sold / Average Inventory — how many times inventory moves through the business"],
      ["Debt ratio","Total Liabilities / Total Assets — >50% means firm relies more on debt than equity"],
      ["Net profit margin","Net Income / Sales — how much profit is earned per dollar of revenue"],
      ["Return on equity","Net Income / Average Owners' Equity — return generated for shareholders"],
      ["Budget","Organization's plan for how it will raise and spend money during a specific period"],
      ["Cash budget","Tracks monthly cash inflows and outflows; identifies surpluses and deficits"],
    ]
  },
  {
    num: 18, title: "Financial Management", emoji: "💰",
    sections: [
      { heading: "Finance vs. Accounting & The 4 Goals", bullets: [
        "Finance: planning, obtaining, and managing the company's funds to accomplish its objectives",
        "Key distinction: Accounting RECORDS what has happened; Finance PLANS what should happen next",
        "Finance answers: Where do we get money? Where do we spend it? How do we maximize its value?",
        "FOUR GOALS of financial management:",
        "1. Maximizing the overall worth of the firm (shareholder wealth maximization)",
        "2. Meeting expenses — ensuring enough cash for day-to-day operations",
        "3. Investing in assets — acquiring equipment, technology, infrastructure",
        "4. Increasing profits to shareholders — rewarding those who provided capital",
      ]},
      { heading: "Finance Hierarchy & Risk-Return Trade-Off", bullets: [
        "FINANCE HIERARCHY (top to bottom):",
        "CEO → CFO → VP Financial Planning → Treasurer → Controller",
        "CFO (Chief Financial Officer) → reports directly to CEO; heads all finance functions",
        "Treasurer → manages all financing activities: cash management, tax planning, and preparation",
        "Controller → keeps the company's books; prepares financial statements; conducts internal audits",
        "RISK-RETURN TRADE-OFF: maximizing shareholder wealth by striking the RIGHT balance between risk and return",
        "Too much debt → risky: firm must make interest payments REGARDLESS of how much cash is coming in",
        "Too much cash on hand → opportunity cost: idle cash earns nothing and could be invested",
        "Higher risk = potential for higher return; lower risk = lower return — managers must find the optimal point",
      ]},
      { heading: "Capital Structure: Debt vs. Equity", bullets: [
        "DEBT CAPITAL: funds obtained through BORROWING (loans, bonds, commercial paper)",
        "EQUITY CAPITAL: funds provided by the firm's OWNERS — reinvesting earnings, issuing shares, or raising outside investor capital",
        "CAPITAL STRUCTURE: the mix of a firm's debt and equity capital — every firm has a unique mix",
        "WHY USE DEBT? Debt is frequently the LEAST COSTLY method of raising financing — interest payments are tax-deductible",
        "WHY DEBT IS RISKY: more debt = higher FIXED COSTS (interest) = firm becomes MORE sensitive to any change in sales revenue",
        "EQUITY: more flexible repayment (dividends are optional); but shareholders want CONTROL (voting rights)",
        "DEBT vs. EQUITY TRADE-OFF: debt = cheaper but riskier; equity = more expensive but more flexible",
        "LEVERAGE: increasing the rate of return on funds invested by BORROWING — using debt to amplify returns",
      ]},
      { heading: "Short & Long-Term Financing", bullets: [
        "SHORT-TERM FINANCING SOURCES (funds needed for less than one year):",
        "1. TRADE CREDIT: supplier extends credit when firm receives goods/services; pays at a LATER DATE",
        "Most common form of short-term financing for businesses",
        "2. SHORT-TERM LOANS: used to finance INVENTORY and ACCOUNTS RECEIVABLE",
        "3. COMMERCIAL PAPER: short-term IOU sold in multiples of $100K–$1M; maturity 1–270 days",
        "EXAM TRICK: Trade credit is SHORT-TERM financing — NOT long-term!",
        "LONG-TERM FINANCING SOURCES:",
        "1. PUBLIC SALE OF SHARES AND BONDS: IPO (Initial Public Offering) is company's first public sale of stock",
        "2. PRIVATE PLACEMENTS: securities sold to a small group of institutional investors — often CHEAPER than IPO",
        "3. VENTURE CAPITALISTS: invest in new/growing firms for ownership share",
        "4. PRIVATE EQUITY FUNDS: raise funds from wealthy/institutional investors; invest in companies",
        "5. HEDGE FUNDS: private, less regulated; only for qualified large investors",
      ]},
    ],
    terms: [
      ["Finance","Planning, obtaining, and managing a company's funds to accomplish its objectives effectively and efficiently"],
      ["CFO","Chief Financial Officer — reports directly to CEO; heads all finance functions"],
      ["Treasurer","Responsible for financing activities: cash management, tax planning, and preparation"],
      ["Controller","Keeps the company's books, prepares financial statements, conducts internal audits"],
      ["Risk-return trade-off","Maximizing shareholder wealth by striking the right balance between risk and return"],
      ["Financial plan","Document specifying funds needed, timing of cash flows, and most appropriate sources and uses of funds"],
      ["Debt capital","Funds obtained through borrowing"],
      ["Equity capital","Funds from owners — reinvested earnings, additional contributions, or share issuance"],
      ["Capital structure","The mix of a firm's debt and equity capital"],
      ["Leverage","Borrowing to increase the rate of return on equity — amplifies both gains AND losses"],
      ["Dividend policy","Financial manager's decisions on whether, when, and how much to pay shareholders in cash dividends"],
      ["Trade credit","Credit extended by a supplier; firm receives goods/services and pays later — most common short-term financing"],
      ["Commercial paper","Short-term IOU sold by large corporations; $100K–$1M; maturity 1–270 days; limited to financially strong firms"],
      ["Private placement","Securities sold to a small group of institutional investors — often cheaper than a public offering"],
      ["Venture capitalist","Firm or group investing in new/growing companies in exchange for an ownership share"],
      ["Leveraged buyout (LBO)","Public shareholders bought out using borrowed funds; firm goes private"],
      ["Divestiture","Reverse of merger — company sells off a subsidiary or assets"],
      ["Selloff","Divested assets sold to another existing firm"],
      ["Spinoff","Divested assets form a brand-new independent company"],
    ]
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE FONTS INJECTION
// Dynamically injects Playfair Display + DM Sans + DM Mono into <head>.
// Also adds global CSS: scrollbar styles, keyframe animations, and shared
// hover/transition helper classes that are applied via className.
// Called once at the top of the App component render.
// ─────────────────────────────────────────────────────────────────────────────

const FontLoader = () => {
  if (typeof document !== "undefined" && !document.getElementById("premium-fonts")) {
    // Inject Google Fonts link tag
    const link = document.createElement("link");
    link.id = "premium-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);

    // Inject shared global styles (animations + helper classes)
    const style = document.createElement("style");
    style.innerHTML = `
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }
      ::-webkit-scrollbar-thumb:hover { background: #3a3a5a; }
      html { scroll-behavior: smooth; }

      /* Entrance animation for view transitions */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      /* Shimmer effect (unused currently — available for future loading states) */
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      /* Generic pulse for in-progress indicators */
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.5; }
      }

      .fade-up { animation: fadeUp 0.35s ease forwards; }

      /* Chapter list row hover state */
      .chapter-row:hover { background: rgba(255,255,255,0.03) !important; }
      .chapter-row:hover .ch-arrow { color: #666 !important; transform: translateX(3px); }
      .ch-arrow { transition: transform 0.2s ease, color 0.2s ease; }

      /* Tab bar hover */
      .tab-btn:hover { color: #aaa !important; }

      /* Section pill hover */
      .pill-btn:hover { border-color: #3a3a5a !important; }

      /* Lift-on-hover for cards */
      .card-hover:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
      .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }

      /* Quiz/exam option button hover */
      .option-btn:hover:not(:disabled) { border-color: #3a3a5a !important; background: rgba(255,255,255,0.04) !important; }
      .option-btn { transition: all 0.15s ease; }
    `;
    document.head.appendChild(style);
  }
  return null; // Renders nothing to the DOM
};

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// Single source of truth for colours, typography, and spacing values.
// Keeps the inline-style-heavy component consistent across all views.
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  // Background layers (darkest → lightest)
  bg:       "#08080f",
  surface:  "#0e0e1a",
  surface2: "#141422",
  surface3: "#1a1a2a",

  // Borders
  border:   "#1e1e2e",
  border2:  "#262636",

  // Text
  text:     "#e8e8f0",   // primary
  textSub:  "#9090a8",   // secondary / body copy
  textMute: "#44445a",   // disabled / labels

  // Accent colours
  cream:    "#f0e6d0",   // headings
  gold:     "#c9a84c",
  goldDim:  "#c9a84c30",
  crimson:  "#9B1D20",   // exam / danger
  crimsonDim:"#9B1D2020",
  green:    "#22c55e",   // correct / pass
  red:      "#ef4444",   // incorrect / fail

  // Typography stacks
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontBody:    "'DM Sans', system-ui, sans-serif",
  fontMono:    "'DM Mono', monospace",
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a new array with the elements of `arr` in a random order
 * (Fisher-Yates in-place shuffle on a copy).
 *
 * @template T
 * @param {T[]} arr - The array to shuffle.
 * @returns {T[]} A new shuffled array (original is not mutated).
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Builds a set of multiple-choice quiz questions from a pool of terms.
 * Each question presents one correct definition and three distractor
 * definitions drawn randomly from the full cross-chapter term list.
 *
 * @param {Array<[string, string, number, string]>} pool
 *   Array of [term, definition, chapterNum, chapterTitle] tuples to draw from.
 * @param {Array<[string, string]>} allTermsFlat
 *   The full [term, definition] list used to generate distractors.
 * @param {number} count - Maximum number of questions to generate.
 * @returns {Array<{term, correctDef, chapterNum, chapterTitle, options}>}
 */
function buildQuestions(pool, allTermsFlat, count) {
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
  return picked.map(([term, correctDef, chapterNum, chapterTitle]) => {
    // Pick 3 wrong definitions from terms that are NOT the current one
    const distractors = shuffle(
      allTermsFlat.filter(([t]) => t !== term)
    ).slice(0, 3).map(([, d]) => d);

    return {
      term,
      correctDef,
      chapterNum,
      chapterTitle,
      // Shuffle correct + distractors so the correct answer isn't always first
      options: shuffle([correctDef, ...distractors]),
    };
  });
}

/**
 * Constructs the full 100-question midterm exam, distributing questions
 * proportionally across chapters based on how many terms each chapter has.
 * Each chapter gets at least as many questions as it has terms (up to 8 min),
 * and the total is normalised to exactly TARGET (100) questions.
 *
 * @param {typeof chapters} allChapters - The chapters array defined above.
 * @returns {Array<{chapterNum, chapterTitle, emoji, color, questions}>}
 *   One section object per chapter, each containing its question array.
 */
function buildExam(allChapters) {
  // Flatten all terms with chapter metadata for cross-chapter distractor generation
  const allTermsFlat = allChapters.flatMap(c =>
    c.terms.map(([t, d]) => [t, d, c.num, c.title])
  );

  const total = allTermsFlat.length;
  const TARGET = 100;

  // Allocate proportional question counts, with a floor of min(8, chTerms)
  const counts = allChapters.map(c =>
    Math.max(Math.round((c.terms.length / total) * TARGET), Math.min(8, c.terms.length))
  );

  // Nudge counts up or down one-at-a-time until the total hits exactly TARGET
  let sum = counts.reduce((a, b) => a + b, 0);
  let i = 0;
  while (sum < TARGET) { counts[i % counts.length]++; sum++; i++; }
  while (sum > TARGET) {
    const idx = counts.findIndex((c, j) => c > Math.min(8, allChapters[j].terms.length));
    if (idx === -1) break;
    counts[idx]--; sum--;
  }

  // Build and return the exam sections
  return allChapters.map((ch, ci) => ({
    chapterNum:   ch.num,
    chapterTitle: ch.title,
    emoji:        ch.emoji,
    color:        COLORS[ci],
    questions: buildQuestions(
      ch.terms.map(([t, d]) => [t, d, ch.num, ch.title]),
      allTermsFlat,
      counts[ci]
    ),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Small uppercase label / section header text.
 *
 * @param {{ children: React.ReactNode, color?: string }} props
 */
const Label = ({ children, color }) => (
  <div style={{
    fontFamily: T.fontBody,
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: "0.18em",
    color: color || T.textMute,
    textTransform: "uppercase",
    marginBottom: 4,
  }}>
    {children}
  </div>
);

/**
 * A 1px horizontal rule that respects the app's border colour palette.
 *
 * @param {{ color?: string }} props - Optional accent colour for the divider.
 */
const Divider = ({ color }) => (
  <div style={{
    height: 1,
    background: color ? `${color}25` : T.border,
    margin: "0",
  }} />
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  FontLoader(); // Inject fonts + global styles on first render

  // ── Navigation state ──────────────────────────────────────────────────────
  /** Index into the `chapters` array for the currently open chapter. */
  const [chIdx, setChIdx] = useState(0);

  /** Index into the current chapter's `sections` array. */
  const [secIdx, setSecIdx] = useState(0);

  /** Active tab within the content view: "notes" | "flashcards" | "quiz". */
  const [tab, setTab] = useState("notes");

  // ── Flashcard state ───────────────────────────────────────────────────────
  /**
   * Tracks which flashcards are flipped.
   * Key format: `"${chapterIndex}-${termIndex}"` → boolean.
   */
  const [flipped, setFlipped] = useState({});

  // ── Global search state ───────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ── Top-level view state ──────────────────────────────────────────────────
  /** "chapters" | "content" | "exam" */
  const [view, setView] = useState("chapters");

  // ── Quick quiz state (per-chapter, 10 questions) ──────────────────────────
  /** Array of question objects for the active quick quiz. Null when not started. */
  const [quickQuiz, setQuickQuiz] = useState(null);

  /** Index of the current question within `quickQuiz`. */
  const [qqIdx, setQqIdx] = useState(0);

  /** The option string the user just selected, or null if unanswered. */
  const [qqSelected, setQqSelected] = useState(null);

  /** Running log of answers: [{ correct, term, correctDef, chosen }]. */
  const [qqAnswers, setQqAnswers] = useState([]);

  /** True once the user has answered all quick-quiz questions. */
  const [qqDone, setQqDone] = useState(false);

  // ── Midterm exam state (100 questions, all chapters) ────────────────────────
  /** Array of section objects built by buildExam(). Null until exam is launched. */
  const [examSections, setExamSections] = useState(null);

  /**
   * Stores the user's exam selections.
   * Key format: `"${sectionIndex}-${questionIndex}"` → chosen option string.
   */
  const [examAnswers, setExamAnswers] = useState({});

  /** True after the user clicks "Submit Examination". */
  const [examSubmitted, setExamSubmitted] = useState(false);

  // ── Derived values ────────────────────────────────────────────────────────
  const ch = chapters[chIdx];               // Currently selected chapter
  const color = COLORS[chIdx];              // Accent colour for current chapter

  /** All terms across every chapter, as flat objects (for search). */
  const allTermsFlat = chapters.flatMap(c => c.terms);
  const allTerms = chapters.flatMap((c, ci) =>
    c.terms.map(([term, def]) => ({ term, def, num: c.num, color: COLORS[ci] }))
  );

  /** Live search results (min 2 chars required to start filtering). */
  const results = search.length > 1
    ? allTerms.filter(t =>
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.def.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // ── Layout constants ──────────────────────────────────────────────────────
  const headerH = 64;  // px — height of the sticky top bar
  const tabBarH = 46;  // px — height of the Notes / Cards / Quiz tab strip

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────

  /** Toggle the flip state of a single flashcard. */
  const flip = key => setFlipped(f => ({ ...f, [key]: !f[key] }));

  /**
   * Navigate to a chapter's content view.
   * Resets section index, active tab, and quiz state.
   *
   * @param {number} i - Index into the `chapters` array.
   */
  const selectChapter = (i) => {
    setChIdx(i);
    setSecIdx(0);
    setTab("notes");
    setView("content");
    setQuickQuiz(null);
    setQqDone(false);
    window.scrollTo(0, 0);
  };

  /**
   * Start a quick quiz for the current chapter.
   * Picks up to 10 terms at random, builds MCQ options, and resets all
   * quiz-related state.
   */
  const startQuickQuiz = () => {
    const count = Math.min(ch.terms.length, 10);
    const qs = shuffle(ch.terms).slice(0, count).map(([term, correctDef]) => {
      const distractors = shuffle(allTermsFlat.filter(([t]) => t !== term))
        .slice(0, 3)
        .map(([, d]) => d);
      return { term, correctDef, options: shuffle([correctDef, ...distractors]) };
    });
    setQuickQuiz(qs);
    setQqIdx(0);
    setQqSelected(null);
    setQqAnswers([]);
    setQqDone(false);
    window.scrollTo(0, 0);
  };

  /**
   * Record the user's answer for the current quick-quiz question.
   * No-ops if the question has already been answered.
   *
   * @param {string} opt - The definition string the user tapped.
   */
  const handleQqAnswer = (opt) => {
    if (qqSelected !== null) return; // Already answered
    setQqSelected(opt);
    setQqAnswers(a => [...a, {
      correct: opt === quickQuiz[qqIdx].correctDef,
      term:        quickQuiz[qqIdx].term,
      correctDef:  quickQuiz[qqIdx].correctDef,
      chosen:      opt,
    }]);
  };

  /**
   * Advance to the next quick-quiz question, or mark the quiz as complete
   * if there are no more questions.
   */
  const nextQq = () => {
    if (qqIdx + 1 >= quickQuiz.length) {
      setQqDone(true);
    } else {
      setQqIdx(i => i + 1);
      setQqSelected(null);
    }
    window.scrollTo(0, 0);
  };

  /** Reset all quick-quiz state (returns to the pre-quiz launch screen). */
  const resetQq = () => {
    setQuickQuiz(null);
    setQqDone(false);
    setQqSelected(null);
    setQqAnswers([]);
  };

  /**
   * Generate the exam and switch to the exam view.
   * Resets all previous exam answers and submission state.
   */
  const launchExam = () => {
    setExamSections(buildExam(chapters));
    setExamAnswers({});
    setExamSubmitted(false);
    setView("exam");
    window.scrollTo(0, 0);
  };

  /**
   * Record a user's selection for a single exam question.
   * No-ops once the exam has been submitted.
   *
   * @param {number} si  - Section index (chapter group).
   * @param {number} qi  - Question index within that section.
   * @param {string} opt - The definition string the user chose.
   */
  const setExamAnswer = (si, qi, opt) => {
    if (examSubmitted) return;
    setExamAnswers(prev => ({ ...prev, [`${si}-${qi}`]: opt }));
  };

  // ── Exam progress helpers ─────────────────────────────────────────────────
  const totalExamQs   = examSections ? examSections.reduce((a, s) => a + s.questions.length, 0) : 0;
  const answeredCount = Object.keys(examAnswers).length;
  const canSubmit     = answeredCount === totalExamQs;

  /** Lock in all answers and display the results view. */
  const submitExam = () => { setExamSubmitted(true); window.scrollTo(0, 0); };

  /**
   * Compute per-section and overall results once the exam is submitted.
   * Returns null if the exam hasn't been submitted yet.
   *
   * @type {Array<{...section, qs, correct, total, pct}> | null}
   */
  const examResults = examSubmitted && examSections
    ? examSections.map((sec, si) => {
        const qs = sec.questions.map((q, qi) => {
          const chosen = examAnswers[`${si}-${qi}`];
          return { ...q, chosen, correct: chosen === q.correctDef };
        });
        const correct = qs.filter(q => q.correct).length;
        return { ...sec, qs, correct, total: qs.length, pct: Math.round((correct / qs.length) * 100) };
      })
    : null;

  const examTotalCorrect = examResults ? examResults.reduce((a, r) => a + r.correct, 0) : 0;
  const examTotalPct     = examResults ? Math.round((examTotalCorrect / totalExamQs) * 100) : 0;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      color: T.text,
      fontFamily: T.fontBody,
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ══════════════════════════════════════════════════════════════════
          HEADER — Sticky top bar; content changes per view.
          ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: "rgba(8,8,15,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${view === "exam" ? T.crimson + "40" : T.border}`,
        padding: "0 20px",
        height: headerH,
        display: "flex", alignItems: "center",
        position: "sticky", top: 0, zIndex: 50,
        transition: "border-color 0.4s",
      }}>

        {/* Exam header: back button + progress counter */}
        {view === "exam" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
            {!examSubmitted && (
              <button
                onClick={() => { setView("chapters"); setExamSections(null); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: T.textSub, fontSize: 22, padding: "6px 8px 6px 0", lineHeight: 1, flexShrink: 0, fontFamily: T.fontBody }}
              >
                ←
              </button>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Label color={T.crimson}>Carleton University — BUSI 1001</Label>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700, color: T.cream, lineHeight: 1.2 }}>
                {examSubmitted ? "Exam Results" : "Midterm Examination"}
              </div>
            </div>
            {!examSubmitted && (
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: T.fontMono, fontSize: 18, fontWeight: 500, color: answeredCount === totalExamQs ? T.green : T.text }}>
                  {answeredCount}<span style={{ color: T.textMute, fontSize: 14 }}>/{totalExamQs}</span>
                </div>
                <div style={{ fontFamily: T.fontBody, fontSize: 9, color: T.textMute, letterSpacing: "0.1em" }}>ANSWERED</div>
              </div>
            )}
          </div>

        /* Content header: back button + chapter title + search toggle */
        ) : view === "content" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
            <button
              onClick={() => { setView("chapters"); setShowSearch(false); setSearch(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: T.textSub, fontSize: 22, padding: "6px 8px 6px 0", lineHeight: 1, flexShrink: 0, fontFamily: T.fontBody }}
            >
              ←
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Label color={color}>Chapter {ch.num}</Label>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 600, color: T.cream, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {ch.emoji} {ch.title}
              </div>
            </div>
            <button
              onClick={() => setShowSearch(s => !s)}
              style={{ background: showSearch ? T.surface3 : "none", border: showSearch ? `1px solid ${T.border2}` : "none", borderRadius: 8, cursor: "pointer", color: showSearch ? T.text : T.textMute, fontSize: 15, padding: "6px 10px", flexShrink: 0, fontFamily: T.fontBody, transition: "all 0.2s" }}
            >
              ⌕
            </button>
          </div>

        /* Chapter-list header: app title + global search toggle */
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div>
              <Label>Exam Survival Kit</Label>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 700, color: T.cream, lineHeight: 1.1 }}>Contemporary Business</div>
              <div style={{ fontFamily: T.fontBody, fontSize: 11, color: T.textMute, marginTop: 2 }}>Ch. 1–6 · 16 · 18</div>
            </div>
            <button
              onClick={() => setShowSearch(s => !s)}
              style={{ background: showSearch ? T.surface3 : "none", border: showSearch ? `1px solid ${T.border2}` : "1px solid transparent", borderRadius: 10, cursor: "pointer", color: showSearch ? T.text : T.textMute, fontSize: 16, padding: "8px 12px", fontFamily: T.fontBody, transition: "all 0.2s" }}
            >
              ⌕
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SEARCH DROPDOWN — Shown below the header when showSearch is true.
          Filters across all chapter terms and definitions in real time.
          ══════════════════════════════════════════════════════════════════ */}
      {showSearch && view !== "exam" && (
        <div style={{
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          padding: "12px 20px 16px",
          position: "sticky", top: headerH, zIndex: 49,
        }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search any term across all chapters…"
            autoFocus
            style={{ width: "100%", background: T.surface3, border: `1px solid ${T.border2}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 14, outline: "none", fontFamily: T.fontBody, letterSpacing: "0.01em" }}
          />
          {search.length > 1 && (
            <div style={{ marginTop: 8, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, maxHeight: 260, overflowY: "auto" }}>
              {results.length === 0
                ? <div style={{ padding: "14px 16px", color: T.textMute, fontSize: 13, fontFamily: T.fontBody }}>No results found</div>
                : results.map((t, i) => (
                  <div key={i} style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: T.fontBody, fontWeight: 600, color: t.color, fontSize: 14 }}>{t.term}</span>
                      <span style={{ fontFamily: T.fontMono, color: T.textMute, fontSize: 10, background: T.surface3, padding: "1px 6px", borderRadius: 4 }}>Ch.{t.num}</span>
                    </div>
                    <div style={{ color: T.textSub, fontSize: 12, fontFamily: T.fontBody, lineHeight: 1.5 }}>{t.def}</div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW: CHAPTER LIST
          Home screen. Shows the exam launch card and a list of all
          available chapters to study.
          ══════════════════════════════════════════════════════════════════ */}
      {view === "chapters" && (
        <div style={{ flex: 1 }}>

          {/* Exam launch card — prominent call-to-action */}
          <div style={{ padding: "20px 20px 0" }}>
            <button onClick={launchExam} className="card-hover"
              style={{
                width: "100%", textAlign: "left",
                border: `1px solid ${T.crimson}50`, cursor: "pointer",
                background: `linear-gradient(135deg, ${T.crimson}18 0%, ${T.surface}80 100%)`,
                borderRadius: 18, padding: "20px",
                display: "flex", alignItems: "center", gap: 16,
              }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: T.crimson + "25", border: `1px solid ${T.crimson}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📝</div>
              <div style={{ flex: 1 }}>
                <Label color={T.crimson}>Carleton University — BUSI 1001</Label>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700, color: T.cream, lineHeight: 1.3, marginBottom: 3 }}>Midterm Examination</div>
                <div style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textMute }}>100 questions · all chapters · exam conditions</div>
              </div>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontFamily: T.fontMono, fontSize: 24, fontWeight: 500, color: T.crimson, lineHeight: 1 }}>100</div>
                <div style={{ fontFamily: T.fontBody, fontSize: 9, color: T.textMute, letterSpacing: "0.1em" }}>MCQ</div>
              </div>
            </button>
          </div>

          <div style={{ padding: "20px 20px 8px" }}>
            <Label>Study by Chapter</Label>
          </div>

          {/* Chapter cards */}
          <div style={{ padding: "0 20px 32px", display: "flex", flexDirection: "column", gap: 10 }}>
            {chapters.map((c, i) => {
              const cc = COLORS[i];
              return (
                <button key={i} onClick={() => selectChapter(i)} className="card-hover chapter-row"
                  style={{
                    width: "100%", textAlign: "left",
                    border: `1px solid ${T.border}`,
                    background: T.surface, borderRadius: 16, padding: "16px 18px",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                    transition: "background 0.2s",
                  }}>
                  {/* Chapter emoji badge */}
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${cc}18`, border: `1px solid ${cc}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {c.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.fontBody, fontSize: 10, color: cc, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 3 }}>CH {c.num}</div>
                    <div style={{ fontFamily: T.fontBody, fontSize: 14, color: T.text, fontWeight: 500, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                    <div style={{ fontFamily: T.fontBody, fontSize: 11, color: T.textMute, marginTop: 3 }}>{c.sections.length} sections · {c.terms.length} terms</div>
                  </div>
                  <span className="ch-arrow" style={{ color: T.textMute, fontSize: 18, flexShrink: 0 }}>›</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW: CONTENT (Notes / Flashcards / Quick Quiz)
          ══════════════════════════════════════════════════════════════════ */}
      {view === "content" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Tab bar — switches between the three study modes */}
          <div style={{
            display: "flex",
            background: "rgba(8,8,15,0.95)", backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${T.border}`,
            position: "sticky", top: headerH, zIndex: 40, height: tabBarH,
          }}>
            {[
              { id: "notes",      label: "Notes",  icon: "📖" },
              { id: "flashcards", label: "Cards",  icon: "🃏" },
              { id: "quiz",       label: "Quiz",   icon: "✏️" },
            ].map(t => (
              <button key={t.id} className="tab-btn"
                onClick={() => { setTab(t.id); if (t.id !== "quiz") resetQq(); }}
                style={{
                  flex: 1, height: "100%", border: "none", cursor: "pointer", background: "none",
                  borderBottom: `2px solid ${tab === t.id ? color : "transparent"}`,
                  color: tab === t.id ? color : T.textMute,
                  fontFamily: T.fontBody, fontSize: 13,
                  fontWeight: tab === t.id ? 600 : 400,
                  letterSpacing: "0.02em", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                <span style={{ fontSize: 13 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB: NOTES ─────────────────────────────────────────────── */}
          {tab === "notes" && (
            <div style={{ flex: 1 }}>

              {/* Horizontal scroll pill bar for section selection */}
              <div style={{
                display: "flex", gap: 8, padding: "14px 20px",
                overflowX: "auto", scrollbarWidth: "none",
                background: T.surface, borderBottom: `1px solid ${T.border}`,
                position: "sticky", top: headerH + tabBarH, zIndex: 30,
              }}>
                {ch.sections.map((s, i) => (
                  <button key={i} className="pill-btn" onClick={() => setSecIdx(i)}
                    style={{
                      flexShrink: 0, padding: "6px 14px", borderRadius: 20,
                      border: `1px solid ${i === secIdx ? color : T.border2}`,
                      background: i === secIdx ? `${color}20` : "transparent",
                      color: i === secIdx ? color : T.textMute,
                      fontFamily: T.fontBody, fontSize: 12, cursor: "pointer",
                      whiteSpace: "nowrap", fontWeight: i === secIdx ? 600 : 400,
                      transition: "all 0.15s",
                    }}>
                    {/* Zero-padded section number prefix */}
                    <span style={{ fontFamily: T.fontMono, fontSize: 10, opacity: 0.6, marginRight: 4 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </button>
                ))}
              </div>

              {/* Section content */}
              <div style={{ padding: "24px 22px 48px" }} className="fade-up">
                <h2 style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 700, color: T.cream, margin: "0 0 20px", lineHeight: 1.3, paddingBottom: 14, borderBottom: `1px solid ${color}30` }}>
                  {ch.sections[secIdx].heading}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {ch.sections[secIdx].bullets.map((b, i) => {
                    /*
                     * Detect "category header" bullets: ALL_CAPS strings that end
                     * with a colon and are short enough to be a label (< 60 chars).
                     * These are rendered differently — no dot, no body colour.
                     */
                    const isHeader = b.endsWith(":") && b.length < 60 && b === b.toUpperCase();

                    if (isHeader) return (
                      <div key={i} style={{ marginTop: 6, marginBottom: 2 }}>
                        <div style={{ fontFamily: T.fontBody, fontSize: 10, fontWeight: 700, color: color, letterSpacing: "0.15em" }}>
                          {b}
                        </div>
                      </div>
                    );

                    return (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        {/* Colour dot bullet */}
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 8, opacity: 0.7 }} />
                        <span style={{ fontFamily: T.fontBody, fontSize: 14, color: T.textSub, lineHeight: 1.7 }}>{b}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Prev / Next section navigation */}
                <div style={{ display: "flex", gap: 10, marginTop: 36 }}>
                  {secIdx > 0 && (
                    <button
                      onClick={() => { setSecIdx(s => s - 1); window.scrollTo(0, 0); }}
                      style={{ flex: 1, padding: "13px", background: T.surface2, border: `1px solid ${T.border2}`, borderRadius: 12, color: T.textSub, cursor: "pointer", fontFamily: T.fontBody, fontSize: 13, fontWeight: 500 }}
                    >
                      ← Prev
                    </button>
                  )}
                  {secIdx < ch.sections.length - 1 && (
                    <button
                      onClick={() => { setSecIdx(s => s + 1); window.scrollTo(0, 0); }}
                      style={{ flex: 1, padding: "13px", background: color, border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontFamily: T.fontBody, fontSize: 13, fontWeight: 600 }}
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: FLASHCARDS ─────────────────────────────────────────── */}
          {tab === "flashcards" && (
            <div style={{ padding: "20px 20px 48px" }}>
              <div style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textMute, marginBottom: 16 }}>
                {ch.terms.length} terms · tap any card to reveal definition
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ch.terms.map(([term, def], i) => {
                  const key = `${chIdx}-${i}`;
                  const isFlipped = flipped[key];
                  return (
                    <div key={i} onClick={() => flip(key)} className="card-hover"
                      style={{
                        background: isFlipped ? `${color}12` : T.surface,
                        border: `1px solid ${isFlipped ? color + "50" : T.border}`,
                        borderRadius: 16, padding: "18px 20px",
                        cursor: "pointer", transition: "all 0.2s",
                        WebkitTapHighlightColor: "transparent",
                      }}>
                      {/* Front face: term only */}
                      {!isFlipped ? (
                        <div>
                          <div style={{ fontFamily: T.fontBody, fontSize: 10, color: T.textMute, letterSpacing: "0.1em", marginBottom: 8 }}>TERM — TAP TO REVEAL</div>
                          <div style={{ fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 600, color: color, lineHeight: 1.3 }}>{term}</div>
                        </div>
                      ) : (
                        /* Back face: dim term label + full definition */
                        <div>
                          <div style={{ fontFamily: T.fontBody, fontSize: 11, color: color, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 8, opacity: 0.8 }}>{term}</div>
                          <div style={{ fontFamily: T.fontBody, fontSize: 14, color: T.text, lineHeight: 1.65 }}>{def}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reset all flipped cards */}
              <button
                onClick={() => setFlipped({})}
                style={{ marginTop: 20, width: "100%", padding: "13px", background: T.surface2, border: `1px solid ${T.border2}`, borderRadius: 12, color: T.textMute, cursor: "pointer", fontFamily: T.fontBody, fontSize: 13 }}
              >
                Reset all cards
              </button>
            </div>
          )}

          {/* ── TAB: QUICK QUIZ ─────────────────────────────────────────── */}
          {tab === "quiz" && (
            <div style={{ padding: "20px 20px 48px" }}>

              {/* State 1: Pre-launch screen */}
              {!quickQuiz ? (
                <div className="fade-up">
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 700, color: T.cream, marginBottom: 8 }}>Quick Quiz</div>
                    <div style={{ fontFamily: T.fontBody, fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>
                      10 multiple-choice questions from this chapter with instant feedback after each answer.
                    </div>
                  </div>
                  {/* Chapter quiz launch */}
                  <button onClick={startQuickQuiz} className="card-hover"
                    style={{ width: "100%", padding: "20px", background: `${color}12`, border: `1px solid ${color}40`, borderRadius: 18, cursor: "pointer", textAlign: "left", marginBottom: 12, WebkitTapHighlightColor: "transparent" }}>
                    <Label color={color}>Chapter Quiz</Label>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 700, color: T.cream, marginBottom: 4 }}>{ch.emoji} {ch.title}</div>
                    <div style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textMute }}>{Math.min(ch.terms.length, 10)} questions · instant feedback</div>
                  </button>
                  {/* Full-exam shortcut */}
                  <button onClick={launchExam} className="card-hover"
                    style={{ width: "100%", padding: "20px", background: T.surface, border: `1px solid ${T.crimson}35`, borderRadius: 18, cursor: "pointer", textAlign: "left", WebkitTapHighlightColor: "transparent" }}>
                    <Label color={T.crimson}>Full Exam Mode</Label>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 700, color: T.cream, marginBottom: 4 }}>📝 100-Question Midterm</div>
                    <div style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textMute }}>All chapters · Carleton exam style</div>
                  </button>
                </div>

              /* State 2: Results screen */
              ) : qqDone ? (
                (() => {
                  const score = qqAnswers.filter(a => a.correct).length;
                  const pct   = Math.round((score / quickQuiz.length) * 100);
                  const grade =
                    pct >= 90 ? { label: "Excellent!",     col: T.green }  :
                    pct >= 75 ? { label: "Good job!",       col: "#22c55e"} :
                    pct >= 60 ? { label: "Almost there",    col: "#f59e0b"} :
                                { label: "Keep studying",   col: T.red   };
                  return (
                    <div className="fade-up">
                      {/* Score summary */}
                      <div style={{ background: `${grade.col}12`, border: `1px solid ${grade.col}35`, borderRadius: 20, padding: "28px 22px", textAlign: "center", marginBottom: 24 }}>
                        <Label color={grade.col}>Quiz Complete</Label>
                        <div style={{ fontFamily: T.fontDisplay, fontSize: 56, fontWeight: 900, color: T.cream, lineHeight: 1, marginBottom: 6 }}>{pct}%</div>
                        <div style={{ fontFamily: T.fontBody, fontSize: 14, color: T.textSub, marginBottom: 10 }}>{score} / {quickQuiz.length} correct</div>
                        <div style={{ fontFamily: T.fontBody, fontSize: 16, color: grade.col, fontWeight: 600 }}>{grade.label}</div>
                      </div>

                      {/* Mistake review — only shown if at least one wrong answer */}
                      {qqAnswers.some(a => !a.correct) && (
                        <div style={{ marginBottom: 24 }}>
                          <Label>Review Mistakes</Label>
                          {qqAnswers.filter(a => !a.correct).map((a, i) => (
                            <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 10 }}>
                              <div style={{ fontFamily: T.fontDisplay, fontSize: 15, fontWeight: 700, color: T.red, marginBottom: 12 }}>{a.term}</div>
                              <div style={{ fontFamily: T.fontBody, fontSize: 10, color: T.textMute, letterSpacing: "0.1em", marginBottom: 4 }}>YOUR ANSWER</div>
                              <div style={{ fontFamily: T.fontBody, fontSize: 13, color: "#ef444499", lineHeight: 1.5, paddingLeft: 10, borderLeft: `2px solid ${T.red}40`, marginBottom: 12 }}>{a.chosen}</div>
                              <div style={{ fontFamily: T.fontBody, fontSize: 10, color: T.textMute, letterSpacing: "0.1em", marginBottom: 4 }}>CORRECT ANSWER</div>
                              <div style={{ fontFamily: T.fontBody, fontSize: 13, color: T.green, lineHeight: 1.5, paddingLeft: 10, borderLeft: `2px solid ${T.green}40` }}>{a.correctDef}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={startQuickQuiz} style={{ flex: 1, padding: "13px", background: color, border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontFamily: T.fontBody, fontSize: 13, fontWeight: 600 }}>Try Again</button>
                        <button onClick={resetQq}        style={{ flex: 1, padding: "13px", background: T.surface2, border: `1px solid ${T.border2}`, borderRadius: 12, color: T.textMute, cursor: "pointer", fontFamily: T.fontBody, fontSize: 13 }}>Back</button>
                      </div>
                    </div>
                  );
                })()

              /* State 3: Active question */
              ) : (
                (() => {
                  const q = quickQuiz[qqIdx];
                  return (
                    <div className="fade-up">
                      {/* Progress indicator */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.textMute }}>Question {qqIdx + 1} of {quickQuiz.length}</span>
                          <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.textMute }}>{qqAnswers.filter(a => a.correct).length} correct</span>
                        </div>
                        {/* Continuous progress bar */}
                        <div style={{ height: 3, background: T.surface3, borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", background: color, width: `${(qqIdx / quickQuiz.length) * 100}%`, transition: "width 0.3s ease", borderRadius: 2 }} />
                        </div>
                        {/* Per-question colour dots (green = correct, red = wrong) */}
                        <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                          {qqAnswers.map((a, i) => (
                            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: a.correct ? T.green : T.red }} />
                          ))}
                          {Array(quickQuiz.length - qqAnswers.length).fill(0).map((_, i) => (
                            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: T.surface3 }} />
                          ))}
                        </div>
                      </div>

                      {/* Question stem */}
                      <div style={{ background: T.surface, border: `1px solid ${color}30`, borderRadius: 18, padding: "22px 20px", marginBottom: 16 }}>
                        <Label color={color}>Define the term</Label>
                        <div style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 700, color: T.cream, lineHeight: 1.3 }}>{q.term}</div>
                      </div>

                      {/* Answer options */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                        {q.options.map((opt, i) => {
                          const isCorrect  = opt === q.correctDef;
                          const isSelected = opt === qqSelected;
                          const revealed   = qqSelected !== null;

                          // Determine styling based on reveal state
                          let bg = T.surface, border = `1px solid ${T.border}`, textColor = T.textSub;
                          if (revealed) {
                            if (isCorrect)       { bg = `${T.green}12`; border = `1px solid ${T.green}50`; textColor = T.green; }
                            else if (isSelected) { bg = `${T.red}12`;   border = `1px solid ${T.red}50`;   textColor = T.red;   }
                            else                 { textColor = T.textMute; }
                          }

                          return (
                            <button key={i} onClick={() => handleQqAnswer(opt)} disabled={revealed} className="option-btn"
                              style={{ width: "100%", textAlign: "left", background: bg, border, borderRadius: 14, padding: "14px 16px", cursor: revealed ? "default" : "pointer", display: "flex", gap: 12, alignItems: "flex-start", WebkitTapHighlightColor: "transparent" }}>
                              {/* Option letter badge — changes to ✓ or ✗ after answer */}
                              <span style={{
                                width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                                background: revealed && isCorrect ? `${T.green}25` : revealed && isSelected ? `${T.red}25` : T.surface3,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: T.fontMono, fontSize: 11, fontWeight: 500,
                                color: revealed && isCorrect ? T.green : revealed && isSelected ? T.red : T.textMute,
                              }}>
                                {revealed && isCorrect ? "✓" : revealed && isSelected && !isCorrect ? "✗" : String.fromCharCode(65 + i)}
                              </span>
                              <span style={{ fontFamily: T.fontBody, fontSize: 14, color: textColor, lineHeight: 1.55, flex: 1 }}>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Next button — only visible after an answer has been selected */}
                      {qqSelected !== null && (
                        <button onClick={nextQq}
                          style={{ width: "100%", padding: "14px", background: color, border: "none", borderRadius: 14, color: "#fff", cursor: "pointer", fontFamily: T.fontBody, fontSize: 14, fontWeight: 600 }}>
                          {qqIdx + 1 >= quickQuiz.length ? "See Results →" : "Next Question →"}
                        </button>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW: MIDTERM EXAM (100 questions, all chapters)
          ══════════════════════════════════════════════════════════════════ */}
      {view === "exam" && examSections && (
        <div style={{ flex: 1 }}>

          {/* ── RESULTS SCREEN ───────────────────────────────────────────── */}
          {examSubmitted ? (
            <div style={{ padding: "20px 20px 60px" }} className="fade-up">
              {(() => {
                // Map percentage to Carleton letter grade
                const grade =
                  examTotalPct >= 90 ? { label: "A+", desc: "Outstanding",  col: T.green   } :
                  examTotalPct >= 85 ? { label: "A",  desc: "Excellent",    col: T.green   } :
                  examTotalPct >= 80 ? { label: "A−", desc: "Very Good",    col: "#4ade80" } :
                  examTotalPct >= 77 ? { label: "B+", desc: "Good",         col: "#60a5fa" } :
                  examTotalPct >= 73 ? { label: "B",  desc: "Good",         col: "#60a5fa" } :
                  examTotalPct >= 70 ? { label: "B−", desc: "Satisfactory", col: "#818cf8" } :
                  examTotalPct >= 67 ? { label: "C+", desc: "Adequate",     col: "#f59e0b" } :
                  examTotalPct >= 63 ? { label: "C",  desc: "Adequate",     col: "#f59e0b" } :
                  examTotalPct >= 60 ? { label: "C−", desc: "Marginal",     col: "#fb923c" } :
                  examTotalPct >= 50 ? { label: "D",  desc: "Marginal",     col: T.red     } :
                                       { label: "F",  desc: "Failing",      col: T.red     };

                return (
                  <>
                    {/* Overall score card with per-chapter progress bars */}
                    <div style={{ background: `${grade.col}10`, border: `1px solid ${grade.col}35`, borderRadius: 22, padding: "28px 22px", marginBottom: 24 }}>
                      <Label color={grade.col}>Carleton University — BUSI 1001 — Midterm Exam</Label>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                        <div>
                          <div style={{ fontFamily: T.fontDisplay, fontSize: 60, fontWeight: 900, color: T.cream, lineHeight: 1 }}>{examTotalPct}%</div>
                          <div style={{ fontFamily: T.fontBody, fontSize: 14, color: T.textSub, marginTop: 6 }}>{examTotalCorrect} / {totalExamQs} correct</div>
                        </div>
                        {/* Letter grade badge */}
                        <div style={{ textAlign: "center", background: `${grade.col}18`, border: `1px solid ${grade.col}40`, borderRadius: 18, padding: "14px 22px" }}>
                          <div style={{ fontFamily: T.fontDisplay, fontSize: 40, fontWeight: 900, color: grade.col, lineHeight: 1 }}>{grade.label}</div>
                          <div style={{ fontFamily: T.fontBody, fontSize: 11, color: grade.col, marginTop: 4, opacity: 0.8 }}>{grade.desc}</div>
                        </div>
                      </div>
                      {/* Per-chapter score bars */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {examResults.map((r, i) => (
                          <div key={i}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <div style={{ fontFamily: T.fontBody, fontSize: 11, color: T.textSub }}>{r.emoji} Ch.{r.chapterNum}</div>
                              <div style={{ fontFamily: T.fontMono, fontSize: 11, color: r.color, fontWeight: 500 }}>{r.correct}/{r.total} · {r.pct}%</div>
                            </div>
                            <div style={{ height: 5, background: T.surface3, borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ height: "100%", background: r.color, width: `${r.pct}%`, borderRadius: 3, transition: "width 1s ease" }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Per-chapter mistake review */}
                    {examResults.map((r, si) => {
                      const wrong = r.qs.filter(q => !q.correct);

                      // Perfect score — show a success banner instead of mistake list
                      if (wrong.length === 0) return (
                        <div key={si} style={{ background: `${T.green}0c`, border: `1px solid ${T.green}25`, borderRadius: 14, padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                          <span>✅</span>
                          <div>
                            <div style={{ fontFamily: T.fontBody, fontSize: 13, fontWeight: 600, color: T.green }}>Ch.{r.chapterNum} — {r.chapterTitle}</div>
                            <div style={{ fontFamily: T.fontBody, fontSize: 11, color: T.textMute }}>Perfect score! {r.total}/{r.total}</div>
                          </div>
                        </div>
                      );

                      return (
                        <div key={si} style={{ marginBottom: 24 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${r.color}20` }}>
                            <span style={{ fontSize: 18 }}>{r.emoji}</span>
                            <div>
                              <div style={{ fontFamily: T.fontBody, fontSize: 13, fontWeight: 600, color: r.color }}>Ch.{r.chapterNum} — {r.chapterTitle}</div>
                              <div style={{ fontFamily: T.fontBody, fontSize: 11, color: T.textMute }}>{wrong.length} mistake{wrong.length !== 1 ? "s" : ""} · {r.correct}/{r.total}</div>
                            </div>
                          </div>
                          {wrong.map((q, i) => (
                            <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 8 }}>
                              <div style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 700, color: r.color, marginBottom: 10 }}>{q.term}</div>
                              <div style={{ fontFamily: T.fontBody, fontSize: 10, color: T.textMute, letterSpacing: "0.1em", marginBottom: 4 }}>YOUR ANSWER</div>
                              <div style={{ fontFamily: T.fontBody, fontSize: 13, color: "#ef444488", lineHeight: 1.5, paddingLeft: 10, borderLeft: `2px solid ${T.red}30`, marginBottom: 12 }}>{q.chosen || "(unanswered)"}</div>
                              <div style={{ fontFamily: T.fontBody, fontSize: 10, color: T.textMute, letterSpacing: "0.1em", marginBottom: 4 }}>CORRECT ANSWER</div>
                              <div style={{ fontFamily: T.fontBody, fontSize: 13, color: T.green, lineHeight: 1.5, paddingLeft: 10, borderLeft: `2px solid ${T.green}30` }}>{q.correctDef}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })}

                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                      <button onClick={launchExam}                                          style={{ flex: 1, padding: "14px", background: T.crimson,  border: "none",                         borderRadius: 12, color: "#fff",      cursor: "pointer", fontFamily: T.fontBody, fontSize: 13, fontWeight: 600 }}>Retake Exam</button>
                      <button onClick={() => { setView("chapters"); setExamSections(null); }} style={{ flex: 1, padding: "14px", background: T.surface2, border: `1px solid ${T.border2}`, borderRadius: 12, color: T.textMute, cursor: "pointer", fontFamily: T.fontBody, fontSize: 13 }}>Back to Study</button>
                    </div>
                  </>
                );
              })()}
            </div>

          ) : (
            /* ── EXAM IN PROGRESS ──────────────────────────────────────────── */
            <div>

              {/* Sticky progress bar + chapter jump pills */}
              <div style={{ position: "sticky", top: headerH, zIndex: 40, background: "rgba(8,8,15,0.95)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}`, padding: "12px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textMute }}>{answeredCount} of {totalExamQs} answered</span>
                  <span style={{ fontFamily: T.fontBody, fontSize: 12, color: answeredCount === totalExamQs ? T.green : T.textMute, fontWeight: answeredCount === totalExamQs ? 600 : 400 }}>
                    {answeredCount === totalExamQs ? "✓ Ready to submit" : `${totalExamQs - answeredCount} remaining`}
                  </span>
                </div>
                {/* Overall progress bar: crimson while in progress, green when complete */}
                <div style={{ height: 3, background: T.surface3, borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{ height: "100%", background: answeredCount === totalExamQs ? T.green : T.crimson, width: `${(answeredCount / totalExamQs) * 100}%`, borderRadius: 2, transition: "width 0.2s ease" }} />
                </div>
                {/* Chapter jump pills — anchor-linked, turn coloured when section is complete */}
                <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
                  {examSections.map((sec, si) => {
                    const secAnswered = sec.questions.filter((_, qi) => examAnswers[`${si}-${qi}`] !== undefined).length;
                    const complete    = secAnswered === sec.questions.length;
                    return (
                      <a key={si} href={`#exam-sec-${si}`}
                        style={{ flexShrink: 0, padding: "4px 10px", borderRadius: 20, border: `1px solid ${complete ? sec.color + "60" : T.border2}`, background: complete ? `${sec.color}15` : "transparent", color: complete ? sec.color : T.textMute, fontFamily: T.fontBody, fontSize: 11, textDecoration: "none", whiteSpace: "nowrap", fontWeight: complete ? 600 : 400 }}>
                        {complete ? "✓ " : ""}{sec.emoji} Ch.{sec.chapterNum} {secAnswered}/{sec.questions.length}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Exam cover / instructions block */}
              <div style={{ background: T.surface, borderBottom: `1px solid ${T.crimson}25`, padding: "24px 22px", margin: "0 0 4px" }}>
                <Label color={T.crimson}>Carleton University</Label>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 700, color: T.cream, marginBottom: 4 }}>BUSI 1001: Contemporary Business</div>
                <div style={{ fontFamily: T.fontBody, fontSize: 13, color: T.textSub, marginBottom: 18 }}>Midterm Examination — {totalExamQs} Questions — All Chapters</div>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  {[["Questions", totalExamQs], ["Time Allowed", "3 hrs"], ["Weight", "40%"], ["Format", "MCQ"]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontFamily: T.fontBody, fontSize: 9, color: T.textMute, letterSpacing: "0.12em", marginBottom: 2 }}>{k.toUpperCase()}</div>
                      <div style={{ fontFamily: T.fontMono, fontSize: 16, color: T.text, fontWeight: 500 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question groups, one per chapter section */}
              {examSections.map((sec, si) => {
                // Calculate the absolute question number for this section's first question
                let qNum = 1;
                for (let i = 0; i < si; i++) qNum += examSections[i].questions.length;

                return (
                  <div key={si} id={`exam-sec-${si}`} style={{ marginBottom: 4 }}>

                    {/* Section header */}
                    <div style={{ background: `${sec.color}10`, borderTop: `2px solid ${sec.color}35`, borderBottom: `1px solid ${sec.color}20`, padding: "16px 22px", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 22 }}>{sec.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <Label color={sec.color}>Section {si + 1} — Chapter {sec.chapterNum}</Label>
                        <div style={{ fontFamily: T.fontDisplay, fontSize: 15, fontWeight: 700, color: T.cream }}>{sec.chapterTitle}</div>
                        <div style={{ fontFamily: T.fontBody, fontSize: 11, color: T.textMute }}>Questions {qNum}–{qNum + sec.questions.length - 1} · {sec.questions.length} questions</div>
                      </div>
                      {/* Section answered count */}
                      {(() => {
                        const done = sec.questions.filter((_, qi) => examAnswers[`${si}-${qi}`] !== undefined).length;
                        return (
                          <div style={{ fontFamily: T.fontMono, fontSize: 13, color: done === sec.questions.length ? T.green : T.textMute, fontWeight: 500 }}>
                            {done}/{sec.questions.length}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Individual questions */}
                    {sec.questions.map((q, qi) => {
                      const absNum = qNum + qi;
                      const chosen = examAnswers[`${si}-${qi}`];
                      return (
                        <div key={qi} style={{ padding: "20px 22px", borderBottom: `1px solid ${T.border}`, background: qi % 2 === 0 ? T.bg : T.surface + "60" }}>
                          {/* Question stem */}
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                            <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.textMute, flexShrink: 0, marginTop: 2, minWidth: 30 }}>{absNum}.</span>
                            <div style={{ fontFamily: T.fontBody, fontSize: 14, color: T.textSub, lineHeight: 1.65 }}>
                              Which of the following best describes{" "}
                              <span style={{ fontFamily: T.fontDisplay, color: T.cream, fontWeight: 600, fontStyle: "italic" }}>{q.term}</span>?
                            </div>
                          </div>

                          {/* Answer options */}
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 40 }}>
                            {q.options.map((opt, oi) => {
                              const letter    = String.fromCharCode(65 + oi); // A, B, C, D
                              const isChosen  = chosen === opt;
                              return (
                                <button key={oi} onClick={() => setExamAnswer(si, qi, opt)} className="option-btn"
                                  style={{
                                    textAlign: "left",
                                    border: `1px solid ${isChosen ? sec.color + "70" : T.border}`,
                                    background: isChosen ? `${sec.color}15` : T.surface,
                                    borderRadius: 10, padding: "11px 14px",
                                    cursor: "pointer", display: "flex", gap: 10, alignItems: "center",
                                    WebkitTapHighlightColor: "transparent",
                                  }}>
                                  {/* Radio-style circle badge */}
                                  <span style={{
                                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                                    border: `1.5px solid ${isChosen ? sec.color : T.border2}`,
                                    background: isChosen ? sec.color : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: T.fontMono, fontSize: 10, fontWeight: 500,
                                    color: isChosen ? "#fff" : T.textMute,
                                    transition: "all 0.15s",
                                  }}>
                                    {letter}
                                  </span>
                                  <span style={{ fontFamily: T.fontBody, fontSize: 13, color: isChosen ? T.text : T.textSub, lineHeight: 1.5, flex: 1 }}>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Submit section */}
              <div style={{ padding: "28px 22px 56px", background: T.surface, borderTop: `1px solid ${T.border}` }}>
                {/* Warning banner if questions are still unanswered */}
                {!canSubmit && (
                  <div style={{ background: "#f59e0b10", border: "1px solid #f59e0b30", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontFamily: T.fontBody, fontSize: 13, color: "#f59e0b", lineHeight: 1.5 }}>
                    ⚠️ {totalExamQs - answeredCount} question{totalExamQs - answeredCount !== 1 ? "s" : ""} unanswered — will be marked incorrect.
                  </div>
                )}
                {/* Submit button — styled grey until all questions answered */}
                <button
                  onClick={submitExam}
                  style={{
                    width: "100%", padding: "16px",
                    background: canSubmit ? T.crimson : T.surface3,
                    border: canSubmit ? "none" : `1px solid ${T.border2}`,
                    borderRadius: 14,
                    color: canSubmit ? "#fff" : T.textMute,
                    cursor: canSubmit ? "pointer" : "default",
                    fontFamily: T.fontBody, fontSize: 15, fontWeight: 600, letterSpacing: "0.02em",
                    transition: "all 0.2s",
                  }}>
                  {canSubmit ? "Submit Examination →" : `Submit (${answeredCount}/${totalExamQs} answered)`}
                </button>
                <div style={{ fontFamily: T.fontBody, fontSize: 11, color: T.textMute, textAlign: "center", marginTop: 10 }}>
                  Once submitted, answers cannot be changed.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
