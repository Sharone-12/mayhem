# CLAUDE.md — Market Mayhem

## Project Overview

**Market Mayhem** is a real-time multiplayer social stock market simulation game. Players create companies, trade stocks, and post news to manipulate market prices. It's a party game disguised as a stock market — think Cards Against Humanity meets Wall Street.

**Tech Stack:** Angular 18+ (frontend) · Express.js + Socket.io (backend) · MongoDB Atlas + Mongoose (database)

**Academic Context:** This is a college academic project. The stack is locked to Angular + MongoDB. Quality matters — this is not a throwaway CRUD app. Build it like a real product.

---

## Game Concept

Every player is simultaneously a **CEO** (runs their own company), a **trader** (buys/sells shares in all companies), and a **journalist** (posts news that moves markets). Real companies (Nvidia, Google, etc.) exist alongside player-created ones. The social manipulation IS the game — players post news to pump their own stocks or crash rivals.

**Why it's replayable:** Each session is 15-25 minutes. Random market conditions per round, different players create different chaos, news posts are human-generated so no two games feel the same. Like a board game night but online.

---

## Full Game Flow

### 1. Landing Page
- Clean landing with game title, brief tagline
- Two buttons: "Create World" and "Join World"
- No auth required for MVP — just pick a username and avatar (from 10-12 preset avatars)
- Show recent public game results as a feed (optional, stretch goal)

### 2. Create World (Host Flow)
Host fills out:
- **World name** (e.g., "Wall Street Warfare")
- **Number of rounds:** 4, 6, or 8 (default 6)
- **Phase timers:** CEO phase 60s, Market phase 90s (host can adjust)
- **Starting cash:** ₹1,00,000 (default, host can change)
- **Real companies toggle:** include real companies (Nvidia, Google, Apple, Tesla, Reliance, TCS, Infosys, etc.) or player-only
- **Max players:** 2-10

On creation, generate a 6-character alphanumeric room code (uppercase, e.g., "MKT7X3"). Host enters the waiting room.

### 3. Join World
- Enter room code
- Pick username + avatar
- Enter waiting room

### 4. Waiting Room / Company Creation
All players see who's joined. Each player MUST create their company before the game starts:

Company creation form:
- **Company name** (unique within this world, 3-30 chars)
- **Sector** (pick one): AI, Fintech, E-Commerce, Gaming, Healthcare, Energy, Food & Beverage, Social Media, Space, Memes (yes, memes is a sector)
- **Tagline** (one-liner description, max 100 chars, e.g., "We put AI in your toaster")
- **Starting stock price:** auto-calculated based on sector (AI/Space companies start higher because hype)

Host sees a "Start Game" button. It activates only when all players have created their company (min 2 players).

### 5. Game Loop — Rounds

Each round has 3 sub-phases:

#### Phase 0 — Market Briefing (5 seconds, auto)
A random **market condition** is revealed for this round. This affects all companies in a specific sector:
- "AI Boom" → all AI sector companies get +5% baseline boost
- "Recession Fears" → all companies get -3% baseline
- "Meme Stocks Rally" → Memes sector companies get +10%
- "Energy Crisis" → Energy sector -8%
- "Government Contracts" → Healthcare and Space +6%
- "Data Breach Scandal" → Fintech and Social Media -5%
- "Holiday Season" → E-Commerce and Food & Beverage +7%
- "Esports Tournament" → Gaming +8%
- "Bull Market" → everything +3%
- "Market Crash" → everything -6%

Display this prominently with an animation. Players need to factor this into their strategy.

#### Phase 1 — CEO Decisions (60 seconds)

Each player picks ONE action for their company. Timer counts down. If timer expires without a pick, no action is taken (forfeit).

**Available CEO Actions:**

1. **Launch Product**
   - Cost: 15% of company's current revenue
   - Effect: +12% revenue next round, +5% stock price immediately
   - Flavor: Player names their product (free text, max 50 chars)
   - Shows in the game feed: "[Company] launched [Product Name]!"

2. **Invest in R&D**
   - Cost: 10% of company's current revenue
   - Effect: No immediate benefit. +3% compounding growth rate per round (stacks). Pays off in rounds 3+
   - Best for: long game strategy

3. **Aggressive Marketing**
   - Cost: 20% of company's current revenue
   - Effect: +8% stock price immediately, +3% next round
   - Diminishing returns: if used 2 rounds in a row, second use gives half effect

4. **Hire Talent**
   - Cost: 12% of company's current revenue
   - Target: pick another player's company
   - Effect: your growth rate +2%, their growth rate -2%
   - Shows in feed: "[Company A] poached talent from [Company B]!"
   - Can create rivalries and drama

5. **Cut Costs**
   - Cost: none (that's the point)
   - Effect: +15% cash immediately, but -4% growth rate permanently
   - Desperation move — good for short term survival

6. **Partnership**
   - Cost: 8% of both companies' revenue
   - Target: pick another player's company
   - Effect: both companies get +5% stock price and +2% growth
   - THE OTHER PLAYER MUST ACCEPT (they get a popup during CEO phase)
   - If declined, you wasted your action and they still have theirs
   - Shows in feed: "[Company A] and [Company B] announced a partnership!"

7. **Hostile Takeover Attempt**
   - Cost: 30% of your cash reserves
   - Target: a company whose stock price is less than 60% of yours
   - Effect: if successful (coin flip weighted by your cash advantage), you absorb their revenue and their stock price boosts yours by 20%. they're "acquired" — that player keeps playing as a pure trader with no company
   - If failed: you lose the cash, target gets +10% stock price (market sees them as resilient)
   - HIGH RISK HIGH REWARD. creates insane moments
   - Only available from round 3 onwards

All actions resolve simultaneously at the end of the phase. Results shown in a quick 5-second animation feed.

#### Phase 2 — Market Phase (90 seconds)

This is where chaos lives. Two things happen simultaneously:

**A. Trading**
- Every player can buy/sell shares of ANY company (real or player-made)
- Simple UI: company list with current price, buy/sell buttons, quantity input
- Trades execute instantly at current price
- Price impact: each trade moves the price slightly
  - Buying: price increases by `0.5% × (shares bought / total available shares)`
  - Selling: price decreases by `0.5% × (shares sold / total available shares)`
  - This means large trades move markets more — realistic
- Players can see the order flow in real-time (who's buying/selling what)
- Short selling is NOT allowed (keeps it simpler for academic scope)

**B. News Posting**
- Each player gets **3 news posts per round**
- Post format: free text (max 200 chars) + tag ONE target company + sentiment tag (bullish 🚀 or bearish 💀)
- Posted news appears in the live news ticker that ALL players see
- Other players can react: 🚀 (agree bullish) or 💀 (agree bearish)
- **News impact on stock price:**
  - Base impact: ±3% on the tagged company
  - Each 🚀 reaction: additional +1%
  - Each 💀 reaction: additional -1%
  - Net reactions determine final direction
  - Impact applies immediately when reactions come in
  - If a post gets 0 reactions, only the base ±3% applies based on the author's sentiment tag

**News posting rules:**
- You CAN post about your own company (glazing yourself)
- You CAN post about other players' companies
- You CAN post about real companies
- You CANNOT post more than 2 posts about the same company per round (anti-spam)
- News posts are attributed (everyone sees who posted it)

#### Between Rounds — Recap Screen (10 seconds)

Quick stats display:
- Stock price chart showing all companies' movement that round
- "Biggest Gainer" and "Biggest Loser" (company)
- "Wolf of Wall Street" — player who made the most profit trading
- "Fake News King" — player whose news posts had the most total reactions
- "Best CEO Move" — most impactful action

### 6. Game End — Final Standings

After all rounds complete, show the final leaderboard. **Composite scoring:**

```
Final Score = (Stock Price Rank × 35) + (Portfolio Value Rank × 35) + (Total Revenue Rank × 15) + (Influence Score Rank × 15)
```

- **Stock Price Rank:** where your company's stock ended up vs other player companies (real companies excluded from ranking)
- **Portfolio Value Rank:** your cash + value of all holdings
- **Total Revenue Rank:** cumulative revenue your company generated across all rounds
- **Influence Score Rank:** total reactions your news posts received across all rounds

Display:
- Overall winner with animation
- Full leaderboard with score breakdown
- "Awards" — fun superlatives:
  - "Market Manipulator" — most news impact
  - "Diamond Hands" — held the same stock the longest
  - "Paper Hands" — most trades executed
  - "Warren Buffett" — best ROI on trades
  - "CEO of the Year" — highest stock price
  - "Bankrupt" — lowest portfolio value (shame award)
- "Play Again" button (creates new world with same players, new room code)

---

## Real Companies Data

Pre-seed the database with these companies. They exist in every world (if host enables real companies). Players can trade them but nobody is their CEO. Their prices move based on:
1. Market conditions each round (sector-based)
2. Player trading volume
3. News posts targeting them

```
Real Companies Seed Data:
- Nvidia      | AI          | "The way it's meant to be played" | Starting Price: ₹800
- Google      | AI          | "Don't be evil (sometimes)"       | Starting Price: ₹750
- Apple       | E-Commerce  | "Think different"                 | Starting Price: ₹700
- Tesla       | Energy      | "Accelerating sustainable energy" | Starting Price: ₹600
- Reliance    | Energy      | "Growth is life"                  | Starting Price: ₹500
- TCS         | Fintech     | "Building on belief"              | Starting Price: ₹400
- Infosys     | Fintech     | "Navigate your next"              | Starting Price: ₹350
- Amazon      | E-Commerce  | "Work hard. Have fun. Make history"| Starting Price: ₹650
- Meta        | Social Media| "Move fast and break things"      | Starting Price: ₹550
- SpaceX      | Space       | "Making life multiplanetary"      | Starting Price: ₹900
```

Real companies have fixed fundamentals that don't change — they're the "blue chips" of the game. Their growth rate is a steady 1-2% per round plus market conditions. They're the safe investment vs the volatile player companies.

---

## Price Engine — How Stock Prices Move

This is the core algorithm. Run on the server at the end of each round and in real-time during market phase for trades.

### End-of-Round Price Calculation (for all companies):

```
newPrice = currentPrice
  × (1 + marketConditionModifier)        // from the random market condition
  × (1 + ceoActionModifier)              // from CEO decision
  × (1 + growthRate)                      // compound growth from R&D investments
  × (1 + tradeVolumeModifier)            // net buy/sell pressure during market phase
  × (1 + newsImpactModifier)             // net impact from all news posts about this company

// Clamp: price can never go below ₹1 (penny stock) or above ₹10,000
newPrice = Math.max(1, Math.min(10000, newPrice))
```

### Real-time Price Updates During Market Phase:

When a trade executes:
```
if (buy):
  priceChange = currentPrice × 0.005 × (sharesBought / availableShares)
  newPrice = currentPrice + priceChange

if (sell):
  priceChange = currentPrice × 0.005 × (sharesSold / availableShares)
  newPrice = currentPrice - priceChange
```

When a news post gets a reaction:
```
netSentiment = rocketReactions - skullReactions
priceChange = currentPrice × 0.01 × netSentiment  // 1% per net reaction
newPrice = currentPrice + priceChange
```

### Company Fundamentals:

Each company has:
```
{
  revenue: Number,          // starts at 50000 for player companies
  growthRate: Number,       // starts at 0.02 (2%) for player companies
  morale: Number,           // 0-100, affects growth rate slightly
  cashReserves: Number      // separate from owner's trading cash
}
```

Revenue updates each round:
```
newRevenue = currentRevenue × (1 + growthRate) + ceoActionRevenueBonus
```

Cash reserves:
```
newCash = currentCash + revenue - ceoActionCosts
```

---

## MongoDB Schema (Mongoose Models)

### User Model — `users`
```javascript
const userSchema = new Schema({
  username: { type: String, required: true, trim: true, maxLength: 20 },
  
  // avatar is a preset identifier (e.g., "bull", "bear", "diamond", "rocket", etc.)
  avatar: { type: String, required: true, enum: ['bull', 'bear', 'diamond', 'rocket', 'chart', 'coin', 'crown', 'fire', 'ghost', 'shark', 'whale', 'wolf'] },
  
  // lifetime stats
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 }
  },
  
  createdAt: { type: Date, default: Date.now }
});
```

### World Model — `worlds`
```javascript
const worldSchema = new Schema({
  name: { type: String, required: true, trim: true, maxLength: 30 },
  
  // 6-char uppercase alphanumeric join code
  code: { type: String, required: true, unique: true, length: 6 },
  
  host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  status: { 
    type: String, 
    enum: ['lobby', 'active', 'finished'], 
    default: 'lobby' 
  },
  
  settings: {
    maxPlayers: { type: Number, default: 10, min: 2, max: 10 },
    totalRounds: { type: Number, default: 6, enum: [4, 6, 8] },
    ceoPhaseDuration: { type: Number, default: 60 },    // seconds
    marketPhaseDuration: { type: Number, default: 90 },  // seconds
    startingCash: { type: Number, default: 100000 },
    includeRealCompanies: { type: Boolean, default: true }
  },
  
  // game state
  currentRound: { type: Number, default: 0 },
  currentPhase: { 
    type: String, 
    enum: ['briefing', 'ceo', 'market', 'recap', 'finished'], 
    default: 'briefing' 
  },
  phaseEndsAt: { type: Date },
  
  // the market condition for the current round
  currentMarketCondition: {
    name: String,       // "AI Boom"
    description: String, // "AI sector companies get +5%"
    effects: [{
      sector: String,
      modifier: Number   // e.g., 0.05 for +5%
    }]
  },
  
  players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  
  createdAt: { type: Date, default: Date.now },
  finishedAt: { type: Date }
});

// Index for quick code lookup
worldSchema.index({ code: 1 });
worldSchema.index({ status: 1 });
```

### Company Model — `companies`
```javascript
const companySchema = new Schema({
  worldId: { type: Schema.Types.ObjectId, ref: 'World', required: true },
  
  // null ownerId = real company (not player-owned)
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  
  name: { type: String, required: true, trim: true, maxLength: 30 },
  sector: { 
    type: String, 
    required: true, 
    enum: ['AI', 'Fintech', 'E-Commerce', 'Gaming', 'Healthcare', 'Energy', 'Food & Beverage', 'Social Media', 'Space', 'Memes'] 
  },
  tagline: { type: String, maxLength: 100 },
  isReal: { type: Boolean, default: false },
  
  // determines if this company was acquired by another player
  isAcquired: { type: Boolean, default: false },
  acquiredBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  
  // financials
  stockPrice: { type: Number, required: true },
  previousPrice: { type: Number },  // for showing % change
  priceHistory: [{
    round: Number,
    price: Number,
    _id: false
  }],
  
  fundamentals: {
    revenue: { type: Number, default: 50000 },
    growthRate: { type: Number, default: 0.02 },
    morale: { type: Number, default: 70, min: 0, max: 100 },
    cashReserves: { type: Number, default: 50000 }
  },
  
  totalShares: { type: Number, default: 10000 },
  
  // track R&D investment rounds for compounding
  rdInvestments: { type: Number, default: 0 },
  
  // track consecutive marketing uses for diminishing returns
  consecutiveMarketingRounds: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
});

companySchema.index({ worldId: 1 });
companySchema.index({ worldId: 1, ownerId: 1 });
```

### Portfolio Model — `portfolios`
```javascript
const portfolioSchema = new Schema({
  worldId: { type: Schema.Types.ObjectId, ref: 'World', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  cash: { type: Number, required: true },  // liquid cash for trading
  
  holdings: [{
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    shares: { type: Number, min: 0 },
    avgBuyPrice: { type: Number },  // for P&L calculation
    _id: false
  }],
  
  // recalculated each round
  totalValue: { type: Number, default: 0 },  // cash + sum(shares × currentPrice)
  
  // historical snapshots for the final chart
  valueHistory: [{
    round: Number,
    value: Number,
    _id: false
  }]
});

portfolioSchema.index({ worldId: 1, userId: 1 }, { unique: true });
```

### Action Model — `actions`
```javascript
const actionSchema = new Schema({
  worldId: { type: Schema.Types.ObjectId, ref: 'World', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  round: { type: Number, required: true },
  
  action: { 
    type: String, 
    required: true, 
    enum: ['launch_product', 'invest_rd', 'aggressive_marketing', 'hire_talent', 'cut_costs', 'partnership', 'hostile_takeover'] 
  },
  
  // for actions that target another company
  targetCompanyId: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
  
  // for launch_product
  productName: { type: String, maxLength: 50 },
  
  // for partnership — tracks acceptance
  partnershipStatus: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined'], 
    default: null 
  },
  
  // for hostile_takeover
  takeoverSuccess: { type: Boolean, default: null },
  
  cost: { type: Number, default: 0 },
  resolved: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

actionSchema.index({ worldId: 1, round: 1 });
```

### News Model — `news`
```javascript
const newsSchema = new Schema({
  worldId: { type: Schema.Types.ObjectId, ref: 'World', required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  round: { type: Number, required: true },
  
  content: { type: String, required: true, maxLength: 200 },
  targetCompanyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  
  // author-declared sentiment
  sentiment: { type: String, enum: ['bullish', 'bearish'], required: true },
  
  reactions: {
    rocket: [{ type: Schema.Types.ObjectId, ref: 'User' }],   // user IDs who reacted 🚀
    skull: [{ type: Schema.Types.ObjectId, ref: 'User' }]     // user IDs who reacted 💀
  },
  
  // calculated impact that was applied to stock
  appliedImpact: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
});

newsSchema.index({ worldId: 1, round: 1 });
newsSchema.index({ worldId: 1, targetCompanyId: 1 });
```

### Trade Model — `trades`
```javascript
const tradeSchema = new Schema({
  worldId: { type: Schema.Types.ObjectId, ref: 'World', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  round: { type: Number, required: true },
  
  type: { type: String, enum: ['buy', 'sell'], required: true },
  shares: { type: Number, required: true, min: 1 },
  pricePerShare: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  
  createdAt: { type: Date, default: Date.now }
});

tradeSchema.index({ worldId: 1, round: 1 });
tradeSchema.index({ worldId: 1, userId: 1 });
```

---

## API Routes (REST — Express.js)

These handle non-realtime operations. Everything real-time goes through Socket.io.

### Auth Routes
```
POST /api/auth/register
  Body: { username, avatar }
  Response: { userId, token }
  Notes: No password for MVP. Just create a user and return a JWT.
         JWT payload: { userId, username }

POST /api/auth/login
  Body: { username }
  Response: { userId, token }
  Notes: Find user by username, return JWT. Create if doesn't exist.
```

### World Routes
```
POST /api/worlds
  Auth: required
  Body: { name, settings: { maxPlayers, totalRounds, ceoPhaseDuration, marketPhaseDuration, startingCash, includeRealCompanies } }
  Response: { world object with code }
  Notes: Generate unique 6-char code. Add host to players array. If includeRealCompanies, seed company documents.

GET /api/worlds/:code
  Auth: required
  Response: { world object populated with players and companies }
  Notes: Used when joining — shows world info before joining.

POST /api/worlds/:code/join
  Auth: required
  Response: { world object }
  Notes: Add user to players array. Fail if full or game already active. Create portfolio with starting cash.

GET /api/worlds/:worldId/leaderboard
  Auth: required
  Response: { rankings with composite scores }
  Notes: Only available when world status is 'finished'.
```

### Company Routes
```
POST /api/companies
  Auth: required
  Body: { worldId, name, sector, tagline }
  Response: { company object }
  Notes: Set ownerId to current user. Calculate starting price based on sector.
         Starting prices by sector:
         AI: 150, Fintech: 120, E-Commerce: 110, Gaming: 100,
         Healthcare: 130, Energy: 115, Food & Beverage: 90,
         Social Media: 105, Space: 160, Memes: 50
         Each player can only create ONE company per world.

GET /api/companies/:worldId
  Auth: required
  Response: [array of all companies in world]
  Notes: Include both real and player companies.
```

### Portfolio Routes
```
GET /api/portfolio/:worldId
  Auth: required
  Response: { portfolio object with populated company names }
  Notes: Filter by current user's ID.
```

---

## WebSocket Events (Socket.io)

The backbone of the real-time gameplay. Every game state change flows through here.

### Connection & Room Management

```
// Client connects with auth token
io.use((socket, next) => {
  // verify JWT from socket.handshake.auth.token
  // attach userId to socket
});

// Client → Server
'join-world' { worldCode }
  → Join the socket room for this world
  → Server emits 'player-joined' to room

'leave-world' { worldCode }
  → Leave the socket room
  → Server emits 'player-left' to room

// Server → Client
'player-joined' { player: { userId, username, avatar } }
'player-left' { userId }
'world-updated' { world }  // generic world state update
```

### Company Creation (Lobby Phase)

```
// Client → Server
'create-company' { worldId, name, sector, tagline }
  → Create company doc
  → Server emits 'company-created' to room

// Server → Client
'company-created' { company }
'all-ready' { }  // all players have created companies, host can start
```

### Game Flow Control

```
// Client → Server (host only)
'start-game' { worldId }
  → Validate all players have companies
  → Set world status to 'active', currentRound to 1
  → Roll random market condition
  → Server emits 'game-started' then 'round-started'

// Server → Client
'game-started' { world }
'round-started' { roundNumber, marketCondition, phaseEndsAt }
'phase-changed' { phase, phaseEndsAt }
  → phase: 'briefing' | 'ceo' | 'market' | 'recap'
'round-ended' { recap: { biggestGainer, biggestLoser, wolfOfWallStreet, fakeNewsKing, bestCeoMove } }
'game-over' { finalStandings: { rankings, awards } }
```

### CEO Phase Events

```
// Client → Server
'submit-ceo-action' { worldId, action, targetCompanyId?, productName? }
  → Validate action is legal (has enough cash, valid target, etc.)
  → Store action doc (resolved: false)
  → Server emits 'action-submitted' to room (but DON'T reveal what the action is — just that this player has submitted)

'respond-partnership' { actionId, accept: boolean }
  → If another player proposed a partnership with you
  → Server updates partnershipStatus

// Server → Client
'action-submitted' { userId }  // just shows checkmark, doesn't reveal the action
'partnership-request' { fromUserId, fromCompanyName, actionId }
  → Sent only to the target player
'partnership-response' { actionId, accepted }

'ceo-phase-results' { actions: [{ userId, companyId, action, productName?, targetCompanyId?, success? }] }
  → Sent when CEO phase ends — NOW reveal all actions simultaneously
  → Include resolution results (takeover success/fail, partnership accept/decline)
```

### Market Phase Events

```
// Client → Server
'execute-trade' { worldId, companyId, type: 'buy'|'sell', shares }
  → Validate: enough cash (buy) or enough shares (sell)
  → Execute trade, update portfolio, update stock price
  → Server emits 'trade-executed' and 'price-update'

'post-news' { worldId, content, targetCompanyId, sentiment }
  → Validate: player has posts remaining this round, not exceeding 2 for same company
  → Create news doc
  → Apply base sentiment impact to stock price
  → Server emits 'news-posted' and 'price-update'

'react-to-news' { newsId, reaction: 'rocket'|'skull' }
  → Add user to reaction array (one reaction per user per news)
  → Recalculate impact, update stock price
  → Server emits 'news-reaction-updated' and 'price-update'

// Server → Client
'trade-executed' { trade: { userId, companyId, type, shares, pricePerShare }, newBalance }
  → Broadcast to room so everyone sees market activity

'price-update' { companyId, newPrice, previousPrice, changePercent }
  → Broadcast whenever any price changes (from trades or news)

'news-posted' { news: { id, authorId, authorUsername, content, targetCompanyId, sentiment, createdAt } }
  → Broadcast to room

'news-reaction-updated' { newsId, reactions: { rocket: count, skull: count }, priceImpact }
  → Broadcast to room

'portfolio-updated' { userId, cash, totalValue }
  → Sent to the specific user after their trade
```

### Timer Management (Server-Side)

The server drives ALL timers. Never trust the client.

```
// Server-side timer logic (pseudocode):

function startRound(worldId) {
  // 1. Roll market condition
  // 2. Emit 'round-started' with condition
  // 3. Show briefing for 5 seconds
  // 4. Start CEO phase
  
  setTimeout(() => startCeoPhase(worldId), 5000);
}

function startCeoPhase(worldId) {
  // 1. Update world: currentPhase = 'ceo', phaseEndsAt = now + 60s
  // 2. Emit 'phase-changed' { phase: 'ceo', endsAt }
  // 3. Set timeout for phase end
  
  setTimeout(() => endCeoPhase(worldId), 60000);
}

function endCeoPhase(worldId) {
  // 1. Resolve all submitted actions (see Price Engine)
  // 2. Apply action effects to companies
  // 3. Emit 'ceo-phase-results' with all actions revealed
  // 4. Start market phase
  
  startMarketPhase(worldId);
}

function startMarketPhase(worldId) {
  // 1. Update world: currentPhase = 'market', phaseEndsAt = now + 90s
  // 2. Emit 'phase-changed' { phase: 'market', endsAt }
  // 3. Reset news post counts for all players
  
  setTimeout(() => endMarketPhase(worldId), 90000);
}

function endMarketPhase(worldId) {
  // 1. Apply end-of-round price calculations
  // 2. Update all company priceHistory
  // 3. Recalculate all portfolio totalValues
  // 4. Generate recap stats
  // 5. Emit 'round-ended' with recap
  // 6. If more rounds remain → setTimeout startRound, 10s
  //    Else → emit 'game-over' with final standings
  
  if (currentRound < totalRounds) {
    setTimeout(() => startRound(worldId), 10000);
  } else {
    endGame(worldId);
  }
}
```

---

## Angular Component Architecture

### Module Structure
```
src/app/
├── app.component.ts                    // root component
├── app.routes.ts                       // route definitions
│
├── core/                               // singleton services
│   ├── services/
│   │   ├── socket.service.ts           // Socket.io connection manager
│   │   ├── auth.service.ts             // JWT storage, user state
│   │   ├── game-state.service.ts       // RxJS BehaviorSubjects for all game state
│   │   ├── trading.service.ts          // trade execution logic
│   │   ├── news.service.ts             // news posting and reactions
│   │   └── audio.service.ts            // sound effects (optional but adds juice)
│   ├── guards/
│   │   ├── auth.guard.ts              // redirect to login if no token
│   │   └── game.guard.ts             // redirect to lobby if game not active
│   ├── interceptors/
│   │   └── auth.interceptor.ts        // attach JWT to HTTP requests
│   └── models/
│       ├── world.model.ts
│       ├── company.model.ts
│       ├── portfolio.model.ts
│       ├── news.model.ts
│       ├── trade.model.ts
│       └── action.model.ts
│
├── pages/
│   ├── landing/
│   │   └── landing.component.ts        // hero page with create/join
│   ├── lobby/
│   │   ├── create-world/
│   │   │   └── create-world.component.ts   // world settings form
│   │   ├── join-world/
│   │   │   └── join-world.component.ts     // enter code form
│   │   └── waiting-room/
│   │       └── waiting-room.component.ts   // player list + company creation
│   ├── game/
│   │   ├── game-shell/
│   │   │   └── game-shell.component.ts     // main game layout wrapper
│   │   ├── briefing/
│   │   │   └── briefing.component.ts       // market condition reveal
│   │   ├── ceo-phase/
│   │   │   ├── ceo-phase.component.ts      // action selection UI
│   │   │   ├── action-card/
│   │   │   │   └── action-card.component.ts    // individual action option
│   │   │   ├── partnership-modal/
│   │   │   │   └── partnership-modal.component.ts  // accept/decline popup
│   │   │   └── action-results/
│   │   │       └── action-results.component.ts     // reveal all actions
│   │   ├── market-phase/
│   │   │   ├── market-phase.component.ts   // market phase layout
│   │   │   ├── trading-panel/
│   │   │   │   └── trading-panel.component.ts  // buy/sell UI
│   │   │   ├── news-feed/
│   │   │   │   └── news-feed.component.ts      // scrolling news ticker
│   │   │   ├── news-composer/
│   │   │   │   └── news-composer.component.ts  // write news post
│   │   │   └── portfolio-panel/
│   │   │       └── portfolio-panel.component.ts // your holdings
│   │   ├── recap/
│   │   │   └── recap.component.ts          // between-round stats
│   │   └── final-standings/
│   │       └── final-standings.component.ts // end game leaderboard + awards
│   └── not-found/
│       └── not-found.component.ts
│
├── shared/
│   ├── components/
│   │   ├── countdown-timer/
│   │   │   └── countdown-timer.component.ts    // reusable countdown
│   │   ├── stock-ticker/
│   │   │   └── stock-ticker.component.ts       // scrolling price bar
│   │   ├── price-chart/
│   │   │   └── price-chart.component.ts        // line chart (use ng2-charts / Chart.js)
│   │   ├── company-card/
│   │   │   └── company-card.component.ts       // company info display
│   │   ├── player-avatar/
│   │   │   └── player-avatar.component.ts      // avatar + username
│   │   ├── mini-leaderboard/
│   │   │   └── mini-leaderboard.component.ts   // sidebar rankings
│   │   └── toast/
│   │       └── toast.component.ts              // notification popups
│   └── pipes/
│       ├── currency.pipe.ts                    // format ₹1,00,000
│       └── percent-change.pipe.ts              // +5.2% or -3.1% with color
```

### Routes
```typescript
export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'create', component: CreateWorldComponent, canActivate: [AuthGuard] },
  { path: 'join', component: JoinWorldComponent, canActivate: [AuthGuard] },
  { path: 'join/:code', component: JoinWorldComponent, canActivate: [AuthGuard] },
  { path: 'lobby/:worldId', component: WaitingRoomComponent, canActivate: [AuthGuard] },
  { path: 'game/:worldId', component: GameShellComponent, canActivate: [AuthGuard, GameGuard] },
  { path: '**', component: NotFoundComponent }
];
```

### Key Services Detail

#### SocketService
```typescript
// Wraps socket.io-client
// Handles connection, reconnection, room joining
// Exposes Observable streams for each event type:
//   onPriceUpdate$: Observable<PriceUpdate>
//   onNewsPosted$: Observable<News>
//   onPhaseChanged$: Observable<PhaseChange>
//   onTradeExecuted$: Observable<Trade>
//   etc.
// Components subscribe to these observables
// Service handles emit() for client → server events
```

#### GameStateService
```typescript
// Central state management using RxJS BehaviorSubjects
// Single source of truth for:
//   currentWorld$: BehaviorSubject<World>
//   companies$: BehaviorSubject<Company[]>
//   myPortfolio$: BehaviorSubject<Portfolio>
//   myCompany$: BehaviorSubject<Company>
//   currentPhase$: BehaviorSubject<Phase>
//   currentRound$: BehaviorSubject<number>
//   newsFeed$: BehaviorSubject<News[]>
//   phaseEndTime$: BehaviorSubject<Date>
//
// Updated by SocketService events
// Components read from here, never directly from socket
```

---

## UI/UX Design Direction

### Visual Identity
- **Theme:** Dark mode primary (stock market terminal aesthetic). Think Bloomberg Terminal meets a mobile game.
- **Color Palette:**
  - Background: #0A0A0F (near-black with slight blue)
  - Surface: #14141F
  - Primary accent: #00E676 (green — stocks going up)
  - Danger: #FF1744 (red — stocks going down)
  - Highlight: #FFD600 (gold — for winners, awards)
  - Text primary: #E0E0E0
  - Text secondary: #757575
- **Typography:** 
  - Use a monospace font for numbers/prices (JetBrains Mono or Fira Code from Google Fonts)
  - Use a clean sans-serif for everything else (Inter or Space Grotesk from Google Fonts)
- **Animations:** price changes should flash green/red briefly. News posts slide in from the right. Timer gets a pulse animation when under 10 seconds.

### Key UI Components Behavior

**Stock Ticker Bar (always visible during game):**
- Horizontal scrolling bar at the top showing all company names + current price + % change
- Green text for positive, red for negative
- Updates in real-time as prices change
- Clicking a company in the ticker opens its detail view

**Trading Panel:**
- List of all companies with: name, sector icon, current price, % change, mini sparkline chart
- Click a company → expands to show buy/sell controls
- Quantity input with quick buttons: 1, 5, 10, 25, MAX
- Show estimated cost before confirming
- After trade: brief green/red flash confirmation

**News Feed:**
- Vertical scrolling feed, newest at top
- Each news item shows: author avatar, username, content, target company tag, 🚀/💀 buttons with counts
- Your own posts highlighted with a subtle border
- Composer at the top: text input, company dropdown, bullish/bearish toggle, "Post" button
- Show remaining posts count (e.g., "2 posts left")

**CEO Phase:**
- Full-screen card layout showing all 7 actions as cards
- Each card shows: action name, cost, effect description, icon
- Greyed out if you can't afford it
- Click to select → confirm button appears
- After submission → show waiting state with checkmarks for who has submitted

**Countdown Timer:**
- Prominent circular or bar timer
- Normal color when > 30s
- Yellow pulse when < 30s  
- Red rapid pulse when < 10s
- Tick sound effect in last 5 seconds (optional)

---

## Deployment Architecture

```
Frontend (Angular):
  → Build: ng build --configuration production
  → Host: Vercel (connect GitHub repo, auto-deploy on push)
  → Environment: VITE_API_URL, VITE_SOCKET_URL

Backend (Express + Socket.io):
  → Host: Render.com (free tier) or Railway
  → Environment vars: MONGODB_URI, JWT_SECRET, PORT, CORS_ORIGIN
  → Node.js 18+

Database:
  → MongoDB Atlas (free M0 cluster)
  → Connection string in backend env vars
```

---

## Edge Cases & Validation Rules

1. **Player disconnects mid-game:** Their company persists, their CEO action forfeits for that round, their portfolio stays as-is. If they rejoin (same userId), they resume. Socket room handles reconnection.

2. **Host disconnects:** Assign host to the next player in the players array. Game continues.

3. **Only 1 player left:** Game continues as solo (they're just trading real companies). Weird but valid.

4. **Company name collisions:** Enforce unique name per world at creation time.

5. **Insufficient funds:** Validate server-side before any trade or action. Return error via socket, client shows toast.

6. **Simultaneous trades on same stock:** Process in order received (FIFO). Each trade updates the price, next trade uses the updated price. Mongo's atomic operations handle this.

7. **News about acquired companies:** Still allowed — the company still trades, it just has no CEO making decisions.

8. **Max trades per round:** No limit on number of trades, but each trade has a minimum of 1 share. This prevents spam effectively since each trade costs money.

9. **Game cleanup:** Worlds in 'finished' status get auto-deleted after 24 hours (TTL index on finishedAt). Active worlds abandoned (no socket connections) for 30 minutes get force-finished.

10. **Partnership during CEO phase:** The target player sees a modal. They can accept (both benefit) or decline (proposer wasted their action). If target already submitted their own action, they can still respond to partnership — it's a separate interaction. If timer expires before response, partnership is auto-declined.

---

## Market Conditions Pool (Full List)

```javascript
const MARKET_CONDITIONS = [
  {
    name: "AI Boom",
    description: "Artificial intelligence sector is exploding",
    effects: [{ sector: "AI", modifier: 0.05 }]
  },
  {
    name: "Fintech Revolution",
    description: "Digital payments are the future",
    effects: [{ sector: "Fintech", modifier: 0.06 }]
  },
  {
    name: "E-Commerce Surge",
    description: "Online shopping hits record numbers",
    effects: [{ sector: "E-Commerce", modifier: 0.07 }]
  },
  {
    name: "Gaming Renaissance",
    description: "New console launch drives gaming stocks up",
    effects: [{ sector: "Gaming", modifier: 0.08 }]
  },
  {
    name: "Healthcare Breakthrough",
    description: "Major drug approval boosts healthcare",
    effects: [{ sector: "Healthcare", modifier: 0.06 }]
  },
  {
    name: "Energy Crisis",
    description: "Oil prices spike, energy sector volatile",
    effects: [{ sector: "Energy", modifier: -0.08 }]
  },
  {
    name: "Food Boom",
    description: "Festival season drives F&B revenue",
    effects: [{ sector: "Food & Beverage", modifier: 0.07 }]
  },
  {
    name: "Social Media Scandal",
    description: "Data breach hits social platforms",
    effects: [{ sector: "Social Media", modifier: -0.06 }]
  },
  {
    name: "Space Race",
    description: "Government contracts fuel space companies",
    effects: [{ sector: "Space", modifier: 0.08 }]
  },
  {
    name: "Meme Economy",
    description: "Reddit is leaking. Meme stocks go brrr",
    effects: [{ sector: "Memes", modifier: 0.12 }]
  },
  {
    name: "Bull Market",
    description: "Everything is up. Optimism everywhere",
    effects: [
      { sector: "AI", modifier: 0.03 },
      { sector: "Fintech", modifier: 0.03 },
      { sector: "E-Commerce", modifier: 0.03 },
      { sector: "Gaming", modifier: 0.03 },
      { sector: "Healthcare", modifier: 0.03 },
      { sector: "Energy", modifier: 0.03 },
      { sector: "Food & Beverage", modifier: 0.03 },
      { sector: "Social Media", modifier: 0.03 },
      { sector: "Space", modifier: 0.03 },
      { sector: "Memes", modifier: 0.03 }
    ]
  },
  {
    name: "Market Crash",
    description: "Panic selling. Blood in the streets",
    effects: [
      { sector: "AI", modifier: -0.06 },
      { sector: "Fintech", modifier: -0.06 },
      { sector: "E-Commerce", modifier: -0.06 },
      { sector: "Gaming", modifier: -0.06 },
      { sector: "Healthcare", modifier: -0.06 },
      { sector: "Energy", modifier: -0.06 },
      { sector: "Food & Beverage", modifier: -0.06 },
      { sector: "Social Media", modifier: -0.06 },
      { sector: "Space", modifier: -0.06 },
      { sector: "Memes", modifier: -0.06 }
    ]
  },
  {
    name: "Recession Fears",
    description: "Economic uncertainty grips the market",
    effects: [
      { sector: "AI", modifier: -0.03 },
      { sector: "Fintech", modifier: -0.04 },
      { sector: "E-Commerce", modifier: -0.03 },
      { sector: "Gaming", modifier: -0.02 },
      { sector: "Healthcare", modifier: 0.02 },
      { sector: "Energy", modifier: -0.05 },
      { sector: "Food & Beverage", modifier: -0.01 },
      { sector: "Social Media", modifier: -0.03 },
      { sector: "Space", modifier: -0.04 },
      { sector: "Memes", modifier: 0.05 }
    ]
  },
  {
    name: "Government Regulation",
    description: "New laws target tech and finance",
    effects: [
      { sector: "AI", modifier: -0.04 },
      { sector: "Fintech", modifier: -0.05 },
      { sector: "Social Media", modifier: -0.05 },
      { sector: "Healthcare", modifier: 0.03 }
    ]
  },
  {
    name: "IPO Frenzy",
    description: "Everyone wants to go public",
    effects: [
      { sector: "AI", modifier: 0.04 },
      { sector: "Fintech", modifier: 0.04 },
      { sector: "Space", modifier: 0.04 },
      { sector: "Memes", modifier: 0.06 }
    ]
  }
];
```

---

## Development Priorities (Build Order)

### Phase 1 — Foundation (do this first)
1. Express server with MongoDB connection
2. Mongoose models (all 6)
3. Auth routes (simple JWT)
4. World CRUD routes
5. Socket.io basic setup (connection, rooms)
6. Angular project scaffold with routing
7. Landing page, create/join world pages

### Phase 2 — Core Game Loop
1. Waiting room with company creation
2. Socket events for game flow control (start, phase changes, round transitions)
3. Server-side timer system
4. CEO phase — action selection UI + socket events
5. CEO action resolution logic on server
6. Market phase — trading UI + socket events
7. Trade execution + price update logic
8. Portfolio tracking

### Phase 3 — Social Layer
1. News posting system
2. News feed UI with reactions
3. News impact on stock prices
4. Real-time price ticker
5. Between-round recap screen

### Phase 4 — Polish
1. Final standings + composite scoring
2. Awards/superlatives
3. Price history charts
4. UI animations and transitions
5. Sound effects (optional)
6. Edge case handling (disconnections, timeouts)
7. Play again flow

---

## Commands Reference

```bash
# Backend
cd server
npm init -y
npm install express mongoose socket.io jsonwebtoken bcryptjs cors dotenv
npm install -D nodemon typescript @types/express @types/node
npx tsc --init

# Frontend
ng new market-mayhem --style=scss --routing
cd market-mayhem
npm install socket.io-client chart.js ng2-charts
ng generate component pages/landing
ng generate component pages/lobby/create-world
# ... etc for all components
ng generate service core/services/socket
ng generate service core/services/game-state
ng generate service core/services/auth
ng generate service core/services/trading
ng generate service core/services/news
ng generate guard core/guards/auth
ng generate guard core/guards/game
ng generate pipe shared/pipes/currency
ng generate pipe shared/pipes/percent-change
```

---

## File Structure — Backend

```
server/
├── src/
│   ├── index.ts                    // Express + Socket.io server entry
│   ├── config/
│   │   ├── database.ts             // MongoDB connection
│   │   └── environment.ts          // env vars
│   ├── models/
│   │   ├── User.ts
│   │   ├── World.ts
│   │   ├── Company.ts
│   │   ├── Portfolio.ts
│   │   ├── Action.ts
│   │   ├── News.ts
│   │   └── Trade.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── world.routes.ts
│   │   ├── company.routes.ts
│   │   └── portfolio.routes.ts
│   ├── middleware/
│   │   └── auth.middleware.ts      // JWT verification
│   ├── socket/
│   │   ├── index.ts                // Socket.io initialization
│   │   ├── lobby.handler.ts        // join/leave/company creation events
│   │   ├── game.handler.ts         // game flow control events
│   │   ├── ceo.handler.ts          // CEO action events
│   │   ├── market.handler.ts       // trading events
│   │   └── news.handler.ts         // news posting/reaction events
│   ├── engine/
│   │   ├── price-engine.ts         // all price calculation logic
│   │   ├── action-resolver.ts      // CEO action resolution
│   │   ├── timer-manager.ts        // server-side round/phase timers
│   │   ├── market-conditions.ts    // conditions pool + random selection
│   │   └── scoring.ts              // final composite score calculation
│   └── utils/
│       ├── code-generator.ts       // generate room codes
│       └── validators.ts           // input validation helpers
├── .env
├── package.json
└── tsconfig.json
```

---

This document is the complete source of truth for the Market Mayhem project. Every feature, every schema, every event, every component, every formula is specified here. Build exactly to this spec.
