---
title: HTTP Status Codes
subtitle: What the numbers actually mean
category: Networking
readMinutes: 3
questions:
  - prompt: What class of response does a 2xx status code represent?
    options:
      - The request was redirected
      - The request succeeded
      - The client made an error
      - The server failed
    answer: 1
    explanation: 2xx codes (200 OK, 201 Created, 204 No Content) mean the request was received, understood, and processed successfully.
  - prompt: A client requests a resource that does not exist. Which status fits best?
    options:
      - 400 Bad Request
      - 401 Unauthorized
      - 404 Not Found
      - 500 Internal Server Error
    answer: 2
    explanation: 404 means the server understood the request but found no resource at that URL. 400 is for a malformed request; 401/403 are about auth.
  - prompt: What is the key difference between 401 and 403?
    options:
      - 401 means "who are you?", 403 means "I know who you are, but no"
      - They are identical
      - 401 is a server error, 403 is a client error
      - 403 means the page moved
    answer: 0
    explanation: 401 Unauthorized means authentication is missing or invalid. 403 Forbidden means you are authenticated but not allowed to access this resource.
  - prompt: Which status code indicates a permanent redirect that clients should cache?
    options:
      - 302 Found
      - 301 Moved Permanently
      - 307 Temporary Redirect
      - 304 Not Modified
    answer: 1
    explanation: 301 signals a permanent move; clients and search engines may cache it and update links. 302/307 are temporary.
  - prompt: A 500 status code tells the client that...
    options:
      - The request body was too large
      - Something went wrong on the server, not the client's fault
      - Authentication failed
      - The resource was cached
    answer: 1
    explanation: 5xx codes mean the server failed to fulfill an otherwise valid request. The client generally cannot fix it by changing the request.
---

## Why status codes exist

Every HTTP response carries a three-digit **status code** that tells the client,
in one number, what happened. Getting them right makes your API predictable for
browsers, caches, proxies, and other developers.

## The five families

The first digit tells you the category:

- **1xx — Informational**: rare; the request is being processed.
- **2xx — Success**: it worked. `200 OK`, `201 Created`, `204 No Content`.
- **3xx — Redirection**: go look somewhere else. `301`, `302`, `304`.
- **4xx — Client error**: *you* sent something wrong. `400`, `401`, `403`, `404`, `429`.
- **5xx — Server error**: *the server* broke. `500`, `502`, `503`, `504`.

## The ones you'll use constantly

- **200 OK** — standard success with a body.
- **201 Created** — a resource was created (often after a POST).
- **204 No Content** — success, but nothing to return (common for DELETE).
- **301 / 302** — permanent vs temporary redirect.
- **400 Bad Request** — the request itself is malformed.
- **401 Unauthorized** — you're not authenticated (despite the name).
- **403 Forbidden** — authenticated, but not allowed.
- **404 Not Found** — no such resource.
- **429 Too Many Requests** — you're being rate-limited.
- **500 Internal Server Error** — generic server failure.

## A common mistake

Returning `200 OK` for everything — including errors — and hiding the real
outcome in the JSON body. This breaks caching, monitoring, and client error
handling, because every layer between you and the user trusts the status code.

## The one thing to remember

> The first digit answers "whose problem is it?" — 4xx is the client's, 5xx is
> the server's.
