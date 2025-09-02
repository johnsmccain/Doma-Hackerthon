# AI-Driven Domain Investment Advisor - System Architecture

## 🏗️ System Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js Dashboard]
        B[Portfolio Page]
        C[Recommendations Page]
        D[Market Trends Page]
        E[Buy/Sell Interface]
        F[Wallet Integration]
    end
    
    subgraph "Backend Layer"
        G[FastAPI Server]
        H[Scoring Engine]
        I[Recommendation Engine]
        J[REST APIs]
    end
    
    subgraph "AI Layer"
        K[Domain Scoring Model]
        L[Keyword Embeddings]
        M[Trend Analyzer]
        N[Risk Assessment]
    end
    
    subgraph "Blockchain Layer"
        O[Node.js Doma Integration]
        P[Doma Protocol SDK]
        Q[Smart Contract Interactions]
        R[Transaction Signing]
    end
     
    subgraph "Data Layer"
        S[PostgreSQL Database]
        T[User Profiles]
        U[Domain Data]
        V[Portfolio History]
        W[Recommendations]
    end
    
    subgraph "External Services"
        X[Doma Protocol Testnet]
        Y[Domain Oracles]
        Z[Analytics & Logging]
    end
    
    %% Frontend connections
    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    
    %% Frontend to Backend
    A --> G
    F --> O
    
    %% Backend to AI
    G --> H
    G --> I
    H --> K
    H --> L
    I --> M
    I --> N
    
    %% Backend to Database
    G --> S
    S --> T
    S --> U
    S --> V
    S --> W
    
    %% Backend to Blockchain
    G --> O
    O --> P
    O --> Q
    O --> R
    
    %% Blockchain to External
    O --> X
    P --> X
    
    %% Data flow
    X --> U
    Y --> K
    Z --> G
    
    %% Styling
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef ai fill:#e8f5e8
    classDef blockchain fill:#fff3e0
    classDef data fill:#fce4ec
    classDef external fill:#f1f8e9
    
    class A,B,C,D,E,F frontend
    class G,H,I,J backend
    class K,L,M,N ai
    class O,P,Q,R blockchain
    class S,T,U,V,W data
    class X,Y,Z external
```

## 🔄 Data Flow

### 1. User Authentication Flow
```
Wallet Connect → Frontend → Backend → Database (User Profile)
```

### 2. Portfolio Analysis Flow
```
Frontend Request → Backend API → AI Scoring → Doma Protocol → Database → Response
```

### 3. Recommendation Flow
```
User Profile + Market Data → AI Engine → Risk Assessment → Personalized Recommendations
```

### 4. Trading Flow
```
Frontend Trade Request → Backend Validation → Doma Protocol → Smart Contract → Transaction
```

## 🏛️ Component Details

### Frontend (Next.js 15)
- **Portfolio Dashboard**: Real-time portfolio valuation and health scores
- **Recommendations Engine**: AI-driven buy/sell/hold suggestions
- **Market Trends**: Trending TLDs and keyword analysis
- **Trading Interface**: One-click domain transactions
- **Wallet Integration**: MetaMask/WalletConnect support

### Backend (FastAPI)
- **Scoring Engine**: Domain valuation using heuristics + AI
- **Recommendation Engine**: Personalized investment advice
- **REST APIs**: Clean endpoints for frontend consumption
- **Authentication**: Wallet-based user management

### AI Layer (Python)
- **Domain Scoring**: Rule-based + ML-based valuation
- **Keyword Embeddings**: NLP analysis of domain names
- **Trend Analysis**: Market movement prediction
- **Risk Assessment**: Portfolio risk evaluation

### Blockchain Integration (Node.js)
- **Doma Protocol SDK**: Domain metadata and trading
- **Smart Contract Interactions**: On-chain transactions
- **Transaction Signing**: Wallet integration
- **Event Monitoring**: Real-time blockchain updates

### Data Layer (PostgreSQL)
- **User Management**: Profiles, preferences, risk tolerance
- **Domain Database**: Metadata, valuations, trade history
- **Portfolio Tracking**: Holdings, performance, transactions
- **Recommendation History**: AI suggestions and outcomes

## 🚀 Deployment Architecture

```mermaid
graph LR
    subgraph "Production Environment"
        A[Vercel - Frontend]
        B[Render - Backend API]
        C[Supabase - Database]
        D[GitHub Actions - CI/CD]
    end
    
    subgraph "Development Environment"
        E[Local Development]
        F[Test Database]
        G[Doma Testnet]
    end
    
    A --> B
    B --> C
    D --> A
    D --> B
    E --> F
    E --> G
```

## 📊 API Endpoints

### Core Endpoints
- `GET /api/score?domain=` - Domain valuation scoring
- `GET /api/trends` - Market trends and analysis
- `GET /api/recommendations?user_id=` - Personalized recommendations
- `POST /api/portfolio` - Portfolio management
- `POST /api/trade` - Execute domain trades

### Blockchain Endpoints
- `GET /api/doma/domain/{name}` - Domain metadata from Doma
- `POST /api/doma/buy` - Buy domain transaction
- `POST /api/doma/sell` - Sell domain transaction
- `GET /api/doma/trending` - Trending domains from Doma

## 🔒 Security Considerations

- **Wallet Authentication**: Sign-in with Ethereum
- **API Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize all user inputs
- **Transaction Signing**: User must sign all blockchain transactions
- **Data Encryption**: Sensitive data encryption at rest

## 📈 Scalability Features

- **Microservices Architecture**: Independent scaling of components
- **Caching Layer**: Redis for frequently accessed data
- **Load Balancing**: Multiple backend instances
- **Database Optimization**: Indexed queries and connection pooling
- **CDN**: Static asset delivery optimization
