# Ports in 2 Minutes: How Your Computer Knows Which Door to Open

**Author:** Milos Andric  
**Date:** 2026-06-23

---

When your computer sends data to another machine over the network, it needs to specify more than just the IP address.

The IP address gets the data to the right machine.

But a machine can run many things at the same time:

*   Browser
    
*   Email app
    
*   Database
    
*   Web server
    
*   SSH server
    

So when data reaches that machine, it needs another number to know which application or service should receive it.

That number is the **port**.

* * *

## Ports are like doors

Imagine a building.

The building has one street address.

But it can have many doors.

*   Front door
    
*   Back door
    
*   Delivery door
    
*   Employee door
    

Your computer works in a similar way.

The IP address gets data to the building.

The port tells it which door to use.

> _IP address = building address  
> Port = door_

For example:

_192.168.1.10:443_

* * *

## Common ports

Some ports are commonly used for specific services:

*   80 → HTTP
    
*   443 → HTTPS
    
*   22 → SSH
    
*   5432 → PostgreSQL
    
*   3306 → MySQL
    

When you open a website using HTTPS, your browser usually connects to port `443`.

When you SSH into a server, you usually connect to port `22`.

Same machine.

Different doors.

Different services.

* * *

## Where do ports live?

Ports are not part of the IP address itself.

Ports belong to **TCP** or **UDP**.

That means the port number is not stored in the IP header.

It is stored in the TCP or UDP header.

A simplified I**P packet** looks like this:

```
IP packet
├── IP header
│   ├── Source IP
│   └── Destination IP
│
└── IP payload
    ├── TCP/UDP header
    │   ├── Source port
    │   └── Destination port
    │
    └── Application data
```

So IP gets data to the right machine.

The port gets data to the right application.