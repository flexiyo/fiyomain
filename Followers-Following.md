# Optimized Followers System for PostgreSQL

This document outlines an optimized approach for implementing a **followers-following** system using PostgreSQL. It includes:

1. Creating the `followers` table
2. Indexing for faster lookups
3. Creating the `follow_counts` table for maintaining follower/following counts
4. Querying the existence of a follow relationship
5. Updating counts on follow/unfollow actions
6. Getting the followers of a user
7. Getting the users a person is following

---

## **1. Create `followers` Table**
This table stores the **many-to-many** relationship between users.

```sql
CREATE TABLE followers (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE, -- The user who follows
    following_id UUID REFERENCES users(id) ON DELETE CASCADE, -- The user being followed
    followed_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id) -- Ensures unique follows
);
```

- **`follower_id`** → The user who follows.
- **`following_id`** → The user being followed.
- **`PRIMARY KEY (follower_id, following_id)`** → Prevents duplicate follows.

---

## **2. Create Indexes for Faster Lookups**
```sql
CREATE INDEX idx_follower_id ON followers(follower_id);
CREATE INDEX idx_following_id ON followers(following_id);
```

- These indexes **speed up** queries that filter by `follower_id` or `following_id`.

---

## **3. Create `follow_counts` Table**
This table maintains **both follower count and following count** for each user.

```sql
CREATE TABLE follow_counts (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    follower_count INT DEFAULT 0,
    following_count INT DEFAULT 0
);
```

- **`follower_count`** → Number of followers a user has.
- **`following_count`** → Number of people a user follows.

---

## **4. Check Relationship Existence (Is A Following B?)**
```sql
SELECT EXISTS (
    SELECT 1 FROM followers
    WHERE follower_id = 'user_1_id' AND following_id = 'user_2_id'
);
```

- Returns `TRUE` if **user_1 follows user_2**, else `FALSE`.
- Efficient because it **stops searching on first match**.

---

## **5. Update Follower Counts on Follow/Unfollow**
### **Follow Action**
```sql
INSERT INTO followers (follower_id, following_id)
VALUES ('user_1_id', 'user_2_id')
ON CONFLICT DO NOTHING;  -- Prevent duplicate follows

UPDATE follow_counts
SET follower_count = follower_count + 1
WHERE user_id = 'user_2_id';

UPDATE follow_counts
SET following_count = following_count + 1
WHERE user_id = 'user_1_id';
```
- Ensures that a user **cannot follow the same person twice** (`ON CONFLICT DO NOTHING`).  

### **Unfollow Action**
```sql
DELETE FROM followers
WHERE follower_id = 'user_1_id'
AND following_id = 'user_2_id';

UPDATE follow_counts
SET follower_count = follower_count - 1
WHERE user_id = 'user_2_id';

UPDATE follow_counts
SET following_count = following_count - 1
WHERE user_id = 'user_1_id';
```
- Deletes the relationship and **decrements counts**.

---

## **6. Get Followers of a Specific User**
```sql
SELECT u.id, u.username
FROM users u
JOIN followers f ON u.id = f.follower_id
WHERE f.following_id = 'user_id_here';
```

- Returns a list of users who **follow** `user_id_here`.

---

## **7. Get Users a Person is Following**
```sql
SELECT u.id, u.username
FROM users u
JOIN followers f ON u.id = f.following_id
WHERE f.follower_id = 'user_id_here';
```

- Returns a list of users **`user_id_here` is following**.

---

## **8. Get Follower & Following Counts**
```sql
SELECT follower_count, following_count
FROM follow_counts
WHERE user_id = 'user_id_here';
```

- Fetches the counts **instantly** without running `COUNT(*)` queries.

---

## **Summary**
| **Feature** | **Query** |
|------------|----------|
| Create `followers` table | ✅ |
| Create indexes | ✅ |
| Create `follow_counts` table | ✅ |
| Check follow relationship | ✅ (`EXISTS`) |
| Update counts on follow/unfollow | ✅ |
| Get followers of a user | ✅ |
| Get following of a user | ✅ |
| Get follower & following counts | ✅ |

## END

