# Blue-Ribbon--Backened-development-internship-task



A robust NestJS-based REST API for managing a sporting club with comprehensive member management, sport administration, and subscription handling.


## steps to run it:

### 1. Clone the repository then navigate

cd sporting-club-backend


# 2. Install dependencies

npm install


### 3. Environment Configuration
you can find the .env file in the repo(i didnt remove it in case you wanna check the db)

### 4. Database Setup

# Generate Prisma client
npx prisma generate --schema=src/prisma/schema.prisma
# Push schema to database
npx prisma db push --schema=src/prisma/schema.prisma

##  Known Issues

- you cant do npm start due to problem in cashe manager dependency version conflict (go to supabase instead to cheack the db)

## Testing

### Run Tests
```bash
# Unit tests
npm run test



### Test Structure
- **Unit Tests**: Individual service and controller testing


# Features:

- **Member Management**: Create, read, update, and delete member profiles
- **Sport Administration**: Full CRUD operations for sports with pricing and gender restrictions
- **Subscription System**: Manage member subscriptions to various sports
- **Family Relationships**: Support for family hierarchies with family heads
- **Gender Compatibility**: Automatic validation of member eligibility for sports
- **Performance Optimized**: Caching implementation for high-traffic endpoints
- **Type Safety**: Full TypeScript implementation with Prisma ORM
- **Comprehensive Testing**: Unit tests and E2E tests included

##  Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: class-validator, class-transformer
- **Caching**: cache-manager with Redis support
- **Testing**: Jest, Supertest
- **Language**: TypeScript






##  Database Schema


![Screenshot 2025-07-03 200341](https://github.com/user-attachments/assets/34888c4e-6b79-418c-800d-a6302b78df8c)



## 📁 Project Structure

src/
├── app.module.ts
├── main.ts
├── members/
│   ├── dto/
│   ├── entities/
│   ├── members.controller.ts
│   ├── members.service.ts
│   └── members.module.ts
├── sports/
│   ├── dto/
│   ├── entities/
│   ├── sports.controller.ts
│   ├── sports.service.ts
│   └── sports.module.ts
├── subscriptions/
│   ├── dto/
│   ├── entities/
│   ├── subscriptions.controller.ts
│   ├── subscriptions.service.ts
│   └── subscriptions.module.ts
└── prisma/
    ├── schema.prisma
    └── seed.ts
    └── prisma.services

##  API Examples

## Create a Sport:
insert into
  sports (name, subscription_price, allowed_gender)
values
  ('Basketball', 100.00, 'mix');

### Create a Member:

insert into
  members (first_name, last_name, gender, birthdate)
values
  ('John', 'Doe', 'male', '1990-01-01');




##  Performance Features:

- **Caching**: Sports endpoint cached for 5 minutes using cache-manager
- **Database Optimization**: Efficient queries with Prisma ORM
- **UUID Primary Keys**: Enhanced security and scalability
- **Connection Pooling**: Automatic connection management
- **Selective Loading**: Only fetch required relations

##  Validation & Error Handling

- **Input Validation**: Comprehensive validation using class-validator
- **Error Responses**: Structured error responses with appropriate HTTP status codes
- **Gender Compatibility**: Automatic validation of member eligibility
- **Unique Constraints**: Prevention of duplicate subscriptions
- **Type Safety**: Full TypeScript implementation

##  Monitoring & Logging

- **Structured Logging**: Comprehensive logging throughout the application
- **Error Tracking**: Detailed error messages and stack traces
- **Performance Metrics**: Built-in performance monitoring capabilities




##  Security

- UUID primary keys for enhanced security
- Input validation and sanitization
- Secure database connections
- Environment variable configuration



#  Assumptions made:
1. **UUID Primary Keys**: Used UUID instead of auto-incrementing integers for better scalability and security.

2. **Family Relationships**: Assumed a simple hierarchy where family members can only have one family head, and family heads cannot be family members of others.

3. **Gender Validation**: Strictly enforced gender compatibility between members and sports based on the `allowedGender` field.

4. **Subscription Uniqueness**: Enforced that a member cannot have multiple subscriptions to the same sport using a unique constraint.

5. **Soft vs Hard Deletes**: Implemented hard deletes with CASCADE for simplicity, but this can be changed to soft deletes if needed.

6. **Price Storage**: Used DECIMAL(10,2) for precise monetary calculations.

7. **Caching Strategy**: Implemented simple in-memory caching for the sports endpoint since it's accessed frequently by the mobile app.

8. **Error Handling**: Used appropriate HTTP status codes and detailed error messages for better API usability.

9. **Validation**: Implemented comprehensive input validation using class-validator decorators.

10. **Database Timestamps**: Added created_at and updated_at timestamps for audit trails.

## Performance Optimizations

1. **Caching**: Sports endpoint is cached for 5 minutes to handle thousands of requests efficiently.

2. **Database Indexing**: Unique constraints automatically create indexes for better query performance.

3. **Selective Includes**: Only fetch related data when explicitly needed to avoid over-fetching.

4. **Connection Pooling**: Prisma handles connection pooling automatically.


