# 02 — Clean Architecture & Entity Relationship Diagram (ERD)

---

## 1. Arsitektur Tiga Lapisan (Clean Architecture Blueprint)

Untuk mengatasi tight coupling dan menyederhanakan pemeliharaan jangka panjang, sistem memisahkan tanggung jawab menjadi 3 lapisan:

```
+-------------------------------------------------------------+
|                1. PRESENTATION LAYER (UI)                   |
|  - Server & Client Components (Next.js 16 App Router)       |
|  - Atomic Design Components (Button, CurrencyInput, etc.)   |
|  - Table & Modal Controls                                   |
+------------------------------+------------------------------+
                               |
+------------------------------v------------------------------+
|             2. DOMAIN & APPLICATION LOGIC LAYER             |
|  - Domain Validation (Zod Schemas)                          |
|  - Custom Client Hooks (useCashTransaction, useDraft)       |
|  - Domain Services (Business calculations & sanitization)   |
|  - RBAC Guard & Permission Check                            |
+------------------------------+------------------------------+
                               |
+------------------------------v------------------------------+
|                3. DATA ACCESS LAYER (DAL)                   |
|  - Repository Interfaces (ITransactionRepository, etc.)     |
|  - Prisma Client ORM Implementations                        |
|  - Cache Tag Revalidation Strategy                          |
+-------------------------------------------------------------+
```

### Aturan Ketergantungan (Dependency Rule)
1. **Presentation Layer** tidak boleh mengimpor Prisma Client secara langsung.
2. **Server Actions** bertindak sebagai perantara tipis (transport layer) yang memanggil Service, bukan tempat menaruh query database mentah.
3. **Repository** bertanggung jawab atas persistensi data, transaksi atomik, dan query agregasi.

---

## 2. Diagram Relasi Entitas (ERD)

```mermaid
erDiagram
    ROLE ||--o{ USER : "memiliki"
    USER ||--o{ TRANSACTION : "mencatat"
    USER ||--o{ EVENT : "menerbitkan"
    USER ||--o{ ANNOUNCEMENT : "membuat"
    USER ||--o{ SCHEDULE : "menyusun"
    DONATION_CAMPAIGN ||--o{ DONATION : "menampung"
    USER ||--o{ DONATION : "memverifikasi"

    ROLE {
        string id PK
        string name UK "ADMIN_UTAMA | BENDAHARA | SEKRETARIS | DLL"
    }

    USER {
        string id PK
        string name
        string email UK
        string phone
        string roleId FK
        boolean isActive
    }

    TRANSACTION {
        string id PK
        string type "INCOME | EXPENSE"
        string category
        decimal amount
        datetime transactionAt
        string description
        string attachmentUrl
        string createdById FK
    }

    EVENT {
        string id PK
        string name
        string slug UK
        string description
        datetime date
        string timeLabel
        string location
        string personInCharge
        string status "DRAFT | PUBLISHED | COMPLETED"
        boolean isPublic
        boolean isFeatured
        string posterUrl
        string createdById FK
    }

    SCHEDULE {
        string id PK
        string title
        string roleType "IMAM | MUADZIN | KHATIB | PETUGAS"
        datetime scheduleFor
        string timeLabel
        string personName
        string notes
        string createdById FK
    }

    DONATION_CAMPAIGN {
        string id PK
        string title
        string slug UK
        string description
        decimal targetAmount
        decimal collectedAmount
        string bankAccountName
        string bankAccountNumber
        string qrisImageUrl
        boolean isActive
        string createdById FK
    }

    DONATION {
        string id PK
        string donorName
        string donorEmail
        string donorPhone
        decimal amount
        string status "PENDING | CONFIRMED | CANCELLED"
        datetime donatedAt
        string campaignId FK
        string recordedById FK
    }
```

