---
title: The future of Bitcoin and Ethereum
date: 2019-02-08
updated: 2019-02-13
description:
  The world has gushed over Bitcoin and Ethereum, but the future doesn’t
  look so rosy.
tags: cryptocurrency, future
cover_image: https://i.imgur.com/i56u3j8.jpg
---

(Image credit:
[Nicolas Tissot](https://unsplash.com/photos/Z2yEVIbH-XU))

I’ve loosely followed cryptocurrency for almost a decade. In 2011, I
briefly mined Bitcoin (and Litecoin, when it became clear that GPU
mining BTC was unlikely to net me much of a reward). Bitcoin’s
proof-of-work algorithm to create a trustless ledger was a true
innovation in decentralized systems, and Ethereum’s expansion of it into
a general compute platform was another giant leap. But looking at the
state of the world right now, neither seems poised for the level of
success that is evangelized.

I am bullish on cryptocurrency in general. Our existing monetary system
already operates on a digital ledger, and reducing institutional trust
is a good thing. Moving money and tracking ownership is too important to
leave in the custody of private institutions that have a long history of
looking out for number one. Yet both Bitcoin and Ethereum strike me as
being an imperfect fit for mainstream financial products. Some problems
I see:

- Block discovery is too long to be used for payments.
- High volatility limits use as a method of payment.
- Smart contracts are too unreliable for institutions.

These problems are substantial hurdles that Bitcoin and Ethereum will
have to face in the coming years.

_I'm going to assume the reader is familiar with how cryptocurrencies
operate, at least at a high level. The YouTube channel
[3Brown1Blue](https://www.youtube.com/watch?v=bBC-nXj3Ng4) has a
fantastic explanation of the proof-of-work algorithm, and
[Coinbase](https://support.coinbase.com/customer/en/portal/topics/1070101-digital-currency/articles)
has decent simple explanations of common cryptocurrencies and related
topics._

# Long block discovery

Bitcoin has notoriously long transaction times, taking up to an hour to
fully settle on the network. This isn’t an inherent property of Bitcoin.
The core developers have chosen to keep block discovery times averaging
about 10 minutes and the amount of data per block low, which limit
transaction latency and throughput respectively. Because proof-of-work
requires several blocks to be found before a transaction settles, the
transaction time is a multiple of Bitcoin’s 10-minute block time.
Ethereum’s block time is 15 seconds, for a point of comparison.

> The transaction time is a multiple of Bitcoin’s 10-minute block time.

This puts Bitcoin transactions at a speed somewhere between an ACH
transfer and a credit card. It’s not fast enough to use at the corner
store, but it could work for some sort of payments app; a slow Venmo or
Square Cash. Ethereum is much better, but its 15 second block time means
transactions usually settle in about 3 minutes. This is suitable (if a
little slow) for a payments app, but far too long a wait if you’re
checking out with a line.

There are serious efforts to address this. The
[lightning network](http://lightning.network/) is way for two parties to
confidently settle numerous transactions off-chain, only bringing it
back onto the chain once they've completed their transactions with each
other. With enough individuals maintaining these payment channels, a
payment could occur between 2 parties without a direct connection by
making multiple "hops" where connections exist. The lightning network is
currently operating in a limited capacity, and in the future it could
extend to cross-chain payments—acting as a compatibility layer between
different protocols.

# Price volatility and new currencies

Volatility causes fewer direct problems than slow transactions, but it
makes it difficult to use as a means of transfer. The long transaction
times and volatility exacerbate
[market risk](https://www.investopedia.com/terms/m/marketrisk.asp), the
potential that the currency’s value will decrease by the time the
recipient is able to sell what they’ve been given.
[Steam stopped accepting it in late 2017](https://steamcommunity.com/games/593110/announcements/detail/1464096684955433613)
for exactly this reason.

Those paying suffer the same market risk in the other direction. The
currency might increase in value, encouraging you to hold onto it rather
than spend it. If you were paid with Bitcoin last week, you don’t know
how much purchasing power it will hold next week. The macro-scale impact
of this volatility is visible in the decline of BTC as a payment option
and the rise of the “hodlers.”

> If you were paid with Bitcoin last week, you don’t know how much
> purchasing power it will hold next week.

This price volatility has some organizations attempting to hybridize
fiat currency with cryptocurrency, leading to a rise in
“stablecoins”—digital assets anchored to real-world currencies. A
notable example of this is Tether, USDT, a representation of the US
dollar on the blockchain. These introduce new risks: Tether has had
major delays fulfilling withdrawal requests, and is accused of
[not having adequate balances to fulfill its obligations](https://medium.com/@bitfinexed/bitfinex-and-tether-is-unauditable-why-they-will-never-do-a-real-audit-3324e002b185).

The driving force behind the volatility is that cryptocurrencies are
treated as stock in the projects that issue them. Cryptocurrency
enthusiasts behave like speculators, hoping to buy low and sell high.
The price fluctuates significantly based on project news and the
cryptocurrency market overall, which has the Securities and Exchange
Commission keeping a close eye on the space.

# Smart contracts aren’t reliable

Bitcoin doesn’t have a concept of “smart contracts” in its protocol, but
it’s a core innovation of Ethereum. Ethereum provides guarantees about
execution and integrity of data for smart contracts, but they’re still
arbitrary computer programs. While this opens up the fascinating world
of decentralized apps, it’s not ideal for applications that require a
high level of security. It's bad if CryptoKitties has a bug allowing
attackers to steal your unique cat, but it’s life altering if attackers
steal all of your money.

Many of the potential applications of smart contracts demand such high
security.
[Vitalik has tweeted](https://twitter.com/vitalikbuterin/status/1072158957999771648?lang=en)
about non-financial applications, but verifying college degrees would be
similarly catastrophic if something were to go wrong.

As arbitrary computer programs, Ethereum’s smart contracts provide no
guarantees that they will execute correctly. This relates to the idea of
“correctness” in computer science: How do you prove, without executing
the code, that it will do what you expect? In the world of Ethereum,
your only option is a careful review of the code, with some limited
assistance from auditing software. This is hardly compelling to major
institutions that already operate systems with a high level of
confidence.

> Ethereum’s smart contracts provide no guarantees that they will
> execute correctly.

Major bugs in high-profile projects shows how difficult smart contracts
are to get right. Even Coinbase, arguably the most trusted name in
cryptocurrency, had a bug
[allowing users to credit their account with unlimited Ethereum](https://thenextweb.com/hardfork/2018/03/21/coinbase-smart-contract-bug-allowed-crediting/).
The most infamous is
[the DAO hack](https://medium.com/swlh/the-story-of-the-dao-its-history-and-consequences-71e6a8a551ee),
which was reverted by a hard fork of the Ethereum chain and lead to the
Ethereum/Ethereum Classic split. Parity, a wallet written as a smart
contract,
[is described](https://www.parity.io/the-multi-sig-hack-a-postmortem/#wasthewalletnotaudited)
as having been “audited by the Ethereum Foundation’s DEV team, Parity
and others from the community.” Yet it suffered multiple
[hacks](https://blog.zeppelin.solutions/on-the-parity-wallet-multisig-hack-405a8c12e8f7)
and [bugs](https://github.com/paritytech/parity-ethereum/issues/6995).

Because the Ethereum protocol acts as a runtime for smart contracts,
even smart contracts that are well implemented are vulnerable to bugs
introduced at a protocol level. A recent protocol upgrade, codenamed
Constantinople, was delayed after ChainSecurity discovered it would make
previously secure smart contracts
[vulnerable to a “reentrancy attack.”](https://blog.ethereum.org/2019/01/15/security-alert-ethereum-constantinople-postponement/)
It’s difficult for me to imagine any such institution making a
significant investment into a technology that has a consistent track
record of security vulnerabilities and hacks.

---

# What does this mean for Bitcoin and Ethereum?

Bitcoin’s flaws are not inherent to the protocol, but politics within
its development means that it’s unlikely to change. The entrenched
community of miners and supporters may make it impossible to include the
large changes needed to make it competitive with more modern blockchain
technologies.

Ethereum’s problems are perhaps more fundamental and might be harder to
fix. The premise of the technology is that anyone can write code for a
global computer, but I struggle to see use cases that aren’t better
served by a centralized system. This has borne out in the projects that
have been built on Ethereum; the most widely successful smart contracts
(excluding ERC20 tokens) are for trading or games. These products are
popular with cryptocurrency enthusiasts, but only serve those who are
already actively interested in the space.

Cryptocurrencies have become self-serving, insular communities. Far from
what was proselytized—a global equalizer, a means of transfer
unrestricted by any one party—they have become just another type of
investment for those with wealth to invest in. Neither Bitcoin or
Ethereum have demonstrated that they’re well-suited to solve any of the
world’s problems. I don’t believe that either of them fill a real need
in the world in their current state, and their ecosystems and
communities work now only to fill their own needs.
