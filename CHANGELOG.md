# Changelog

## [1.1.0](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/compare/v1.0.0...v1.1.0) (2025-02-03)


### Features

* **auth:** add teamId to user in PrismaAdapter ([b924972](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/b924972a383922fff84818459d574329892a32a0))
* **auth:** enhance user creation with team and activity logging ([42d1394](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/42d1394475a6fbfdab6fc7513709bfdb42b80149))
* **login:** add redirect to dashboard after OAuth sign-in ([3db4dfb](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/3db4dfb5172865ab858f03c75424f49e70127f81))
* migrate to postgres database ([ebed861](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/ebed861594e5a69ccf657f8a0fad4a932db0920c))


### Bug Fixes

* add prisma auto genereate ([2dd12be](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/2dd12be2e8186515c33e03901a0aac8323fb4116))
* fixed auth.js route path ([9453d80](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/9453d80169a4dbf393d827d113768c90400c8812))
* oauth login default password: 12345678 ([c8b5604](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/c8b5604b31174a2e13ccd7202cb5377174aacd86))
* remove npmrc ([de61d95](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/de61d951b49f307a5a663a7abae5cfaf3f7a217d))
* remove some dept ([bbf3acc](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/bbf3accc0dc4f2221bcd28b28089b02a3c2fc64a))
* remove some dept ([90004f2](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/90004f29fc0f19d5fa0797aa96335831a78dd596))
* update prisma auto deploy ([bcf442a](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/bcf442a095a4e6d9ab7b42b9c8254dbbeb86b9a5))


### Performance Improvements

* **i18n:** add typescript support ([b306247](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/b30624760b4b37e1cf9e137fe849d634d0b22a1c))


### Documentation

* update readme ([49d2818](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/49d2818ba385e2f536cc1fcf93366f23f256bbe9))
* update readme ([b2aff2b](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/b2aff2bf5fd8df4183b39a0067c3da5cd9f9de87))
* update readme ([0f8a77a](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/0f8a77ae5682bf5255b5eeb043aebecddcd0a39c))


### Code Refactoring

* **auth:** make profile function asynchronous in Google provider ([096182b](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/096182b993a3283ff99907f714378fd8fcc01886))

## 1.0.0 (2025-02-01)


### Features

* 3rd oauth login support team auto create ([ce45872](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/ce45872d84b0a591cecf5419fcad8b09ad4368b7))
* add github action ([9d5de1c](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/9d5de1c330cc1ce45abbfcc5d1c945781378497a))
* add github action for auto release and changelog ([1652247](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/1652247d54f92b4c3a056e9de229363ab5b37d81))
* add missing role in seed ([#36](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/issues/36)) ([2fb1e36](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/2fb1e36e1083f34822634fb53ec256b78c4df459))
* add prisma seed ([79f010c](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/79f010c953ee5c1c8e40ed671b0302a74e0a4bb7))
* **auth:** add Google OAuth sign-in and improve password validation ([d5de14c](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/d5de14c329b841d6e539646006e109b38e01e3bd))
* **payments:** enable payment method updates in Stripe customer portal ([4666707](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/4666707463fbe12e35c69d1b1b64e67e64991de6))
* support i18n ([aa4f4a4](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/aa4f4a4682436ab64744e90ef8a01d1f75606ecf))
* support language: jp ([67bb370](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/67bb37047e10e91d7a26cf2989f12a41a9e37079))


### Bug Fixes

* context provider missing role ([a658d15](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/a658d151a2a05cc6d4d3446b5ace4aa32868cd84))
* **layout:** user menu padding ([#55](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/issues/55)) ([5770d64](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/5770d6430cea57acd0abf9b26db6c340757adf8a))
* redirect path from /login to /sign-in ([#64](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/issues/64)) ([0dc81b7](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/0dc81b77603fd09da73b9217eca51161849c9b93))
* remove drizzle ([31ee844](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/31ee844f73d89f627f4eb458fd92b268f79f7317))


### Documentation

* update README with new authentication and ORM details ([3eafca8](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/3eafca8c36719ff8b627043de9ffc786f66ce46d))
* update README with project refactor and upgrade details ([f1399ee](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/f1399ee46904fafcade527ee461ecb2734f0cee2))


### Code Refactoring

* improve auth and activity logging logic ([f64df99](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/f64df99da446840ad0c94e98955fb64d586fe1e7))
* migrate activity logs to use Prisma and update auth ([9ef7a09](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/9ef7a091ca146e1d56fe6a3f9e458e05b5258dc3))
* migrate from Drizzle ORM to Prisma for database management ([188c18e](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/188c18e3bd8f665c82f73beb244575984faca561))
* migrate from Drizzle ORM to Prisma ORM ([4a448cf](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/4a448cfc6af31b089437cb8c9555a1db72f855dd))
* migrate team invitation logic to use Prisma ([95730c5](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/95730c57aa2da36ee3639d8c8333fd27fdd3da11))
* migrate to next-auth and clean up auth code ([a3edfd5](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/a3edfd540a7937f037ed15c89d438201e7831b13))
* migrate updateTeamSubscription to prisma ([ef57e36](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/ef57e36208298171a344ff7137f2bfeca929ef45))
* remove redundant comment in auth config ([ff98b68](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/ff98b68a81ff2d89ffe0b2908a8bc14c3783fcc0))
* update eslint rules and improve code consistency ([1d32743](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/1d327436422fd1eec9c4e1fb8f822efc663272fc))
* update Prisma schema and related configurations ([a1a571e](https://www.github.com/liuhuapiaoyuan/nextjs-prisma-stripe-saas-starter/commit/a1a571e6716df029ccedaf6b100be3ec666ef69f))
