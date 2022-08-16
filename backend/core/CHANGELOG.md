# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.1.1-alpha.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.1.1-alpha.3...@bloom-housing/backend-core@5.1.1-alpha.4) (2022-08-16)


### Reverts

* Revert "feat(backend): add bull job scheduler for afs processing (#2889)" (#2960) ([d790b17](https://github.com/bloom-housing/bloom/commit/d790b17d9c2cabb57a5fff4abb23da420d904d0c)), closes [#2889](https://github.com/bloom-housing/bloom/issues/2889) [#2960](https://github.com/bloom-housing/bloom/issues/2960)





## [5.1.1-alpha.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.1.1-alpha.2...@bloom-housing/backend-core@5.1.1-alpha.3) (2022-08-16)


### Features

* adds includeDemographics if admin ([#2955](https://github.com/bloom-housing/bloom/issues/2955)) ([173b417](https://github.com/bloom-housing/bloom/commit/173b417dd87335788ba7f8bcd4ab260e96d9e573))





## [5.1.1-alpha.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.1.1-alpha.1...@bloom-housing/backend-core@5.1.1-alpha.2) (2022-08-16)


### Features

* **backend:** add bull job scheduler for afs processing ([#2889](https://github.com/bloom-housing/bloom/issues/2889)) ([0354e18](https://github.com/bloom-housing/bloom/commit/0354e18da4daea41f12e573b9449433c5fbc1f94))





## [5.1.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.1.1-alpha.0...@bloom-housing/backend-core@5.1.1-alpha.1) (2022-08-12)


### Bug Fixes

* fix for big timeout on flagged set ([#2946](https://github.com/bloom-housing/bloom/issues/2946)) ([82645b7](https://github.com/bloom-housing/bloom/commit/82645b7593b08ed735b48e6b4e23d669784f6e96))





## [5.1.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.15...@bloom-housing/backend-core@5.1.1-alpha.0) (2022-07-27)


* 2022-07-26 sync master (#2917) ([6f0dd1d](https://github.com/bloom-housing/bloom/commit/6f0dd1df4d2df12e0e94cb339c9232531a37f2a2)), closes [#2917](https://github.com/bloom-housing/bloom/issues/2917) [#2753](https://github.com/bloom-housing/bloom/issues/2753) [#2441](https://github.com/bloom-housing/bloom/issues/2441) [#2460](https://github.com/bloom-housing/bloom/issues/2460) [#2459](https://github.com/bloom-housing/bloom/issues/2459) [#2464](https://github.com/bloom-housing/bloom/issues/2464) [#2465](https://github.com/bloom-housing/bloom/issues/2465) [#2466](https://github.com/bloom-housing/bloom/issues/2466) [#2436](https://github.com/bloom-housing/bloom/issues/2436) [#2451](https://github.com/bloom-housing/bloom/issues/2451) [#2415](https://github.com/bloom-housing/bloom/issues/2415) [#2354](https://github.com/bloom-housing/bloom/issues/2354) [#2455](https://github.com/bloom-housing/bloom/issues/2455) [#2484](https://github.com/bloom-housing/bloom/issues/2484) [#2482](https://github.com/bloom-housing/bloom/issues/2482) [#2483](https://github.com/bloom-housing/bloom/issues/2483) [#2476](https://github.com/bloom-housing/bloom/issues/2476) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2470](https://github.com/bloom-housing/bloom/issues/2470) [#2488](https://github.com/bloom-housing/bloom/issues/2488) [#2487](https://github.com/bloom-housing/bloom/issues/2487) [#2496](https://github.com/bloom-housing/bloom/issues/2496) [#2498](https://github.com/bloom-housing/bloom/issues/2498) [#2499](https://github.com/bloom-housing/bloom/issues/2499) [#2291](https://github.com/bloom-housing/bloom/issues/2291) [#2461](https://github.com/bloom-housing/bloom/issues/2461) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2494](https://github.com/bloom-housing/bloom/issues/2494) [#2503](https://github.com/bloom-housing/bloom/issues/2503) [#2495](https://github.com/bloom-housing/bloom/issues/2495) [#2477](https://github.com/bloom-housing/bloom/issues/2477) [#2505](https://github.com/bloom-housing/bloom/issues/2505) [#2372](https://github.com/bloom-housing/bloom/issues/2372) [#2489](https://github.com/bloom-housing/bloom/issues/2489) [#2497](https://github.com/bloom-housing/bloom/issues/2497) [#2506](https://github.com/bloom-housing/bloom/issues/2506) [#2486](https://github.com/bloom-housing/bloom/issues/2486)


### BREAKING CHANGES

* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62





# [5.1.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@5.0.0...@bloom-housing/backend-core@5.1.0) (2022-07-27)


### Bug Fixes

* adds region to user phone # validation ([#2652](https://github.com/seanmalbert/bloom/issues/2652)) ([f4ab660](https://github.com/seanmalbert/bloom/commit/f4ab660912a4c675073558d407880c8a98687530))
* ami charts without all households ([#2430](https://github.com/seanmalbert/bloom/issues/2430)) ([92dfbad](https://github.com/seanmalbert/bloom/commit/92dfbad32c90d84ee1ec3a3468c084cb110aa8be))
* authservice.token data null issue ([#2703](https://github.com/seanmalbert/bloom/issues/2703)) ([3b1b931](https://github.com/seanmalbert/bloom/commit/3b1b9316a6dd42adc22249b8e8dd836de2258406))
* await casbin enforcer ([4feacec](https://github.com/seanmalbert/bloom/commit/4feacec44635135bc5469c0edd02a3424a2697cc))
* **backend:** mfa_enabled migration fix ([#2503](https://github.com/seanmalbert/bloom/issues/2503)) ([a5b9a60](https://github.com/seanmalbert/bloom/commit/a5b9a604faccef55775dbbc54441251e29999fa4))
* **backend:** nginx with heroku configuration ([#2196](https://github.com/seanmalbert/bloom/issues/2196)) ([a1e2630](https://github.com/seanmalbert/bloom/commit/a1e26303bdd660b9ac267da55dc8d09661216f1c))
* **backend:** translations input validator ([#2466](https://github.com/seanmalbert/bloom/issues/2466)) ([603c3dc](https://github.com/seanmalbert/bloom/commit/603c3dc52a400db815c4d81552a5aa74f397fe0f))
* bump version ([#2349](https://github.com/seanmalbert/bloom/issues/2349)) ([b9e3ba1](https://github.com/seanmalbert/bloom/commit/b9e3ba10aebd6534090f8be231a9ea77b3c929b6))
* bump version ([#2350](https://github.com/seanmalbert/bloom/issues/2350)) ([05863f5](https://github.com/seanmalbert/bloom/commit/05863f55f3939bea4387bd7cf4eb1f34df106124))
* cannot remove some fields in listings management ([#2455](https://github.com/seanmalbert/bloom/issues/2455)) ([acd9b51](https://github.com/seanmalbert/bloom/commit/acd9b51bb49581b4728b445d56c5c0a3c43e2777))
* cannot save custom mailing, dropoff, or pickup address ([#2207](https://github.com/seanmalbert/bloom/issues/2207)) ([96484b5](https://github.com/seanmalbert/bloom/commit/96484b5676ecb000e492851ee12766ba9e6cd86f))
* check for empty translations before sending to google translate service ([#2700](https://github.com/seanmalbert/bloom/issues/2700)) ([d116fdb](https://github.com/seanmalbert/bloom/commit/d116fdbdab3c874679abc8e3dba8e23179fc78e2))
* check for user lastLoginAt ([d78745a](https://github.com/seanmalbert/bloom/commit/d78745a4c8b770864c4f5e6140ee602e745b8bec))
* checks for existance of image_id ([#2505](https://github.com/seanmalbert/bloom/issues/2505)) ([d2051af](https://github.com/seanmalbert/bloom/commit/d2051afa188ce62c42f3d6bf737fd2059f9b7599))
* csv export auth check ([#2488](https://github.com/seanmalbert/bloom/issues/2488)) ([2471d4a](https://github.com/seanmalbert/bloom/commit/2471d4afdd747843f58c0c154d6e94a9c76d733d))
* date validation issue ([#2464](https://github.com/seanmalbert/bloom/issues/2464)) ([158f7bf](https://github.com/seanmalbert/bloom/commit/158f7bf7fdc59954aebfebbd1ad3741239ed1a35))
* dates showing as invalid in send by mail section ([#2362](https://github.com/seanmalbert/bloom/issues/2362)) ([3567388](https://github.com/seanmalbert/bloom/commit/35673882d87e2b524b2c94d1fb7b40c9d777f0a3))
* fix sortig on applications partner grid ([f097037](https://github.com/seanmalbert/bloom/commit/f097037afd896eec8bb90cc5e2de07f222907870))
* fixes linting error ([aaaf858](https://github.com/seanmalbert/bloom/commit/aaaf85822e3b03224fb336bae66209a2b6b88d1d))
* fixes some issues with the deployment ([a0042ba](https://github.com/seanmalbert/bloom/commit/a0042badc5474dde413e41a7f4f84c8ee7b2f8f1))
* fixes tests and also issue with user grid ([da07ba4](https://github.com/seanmalbert/bloom/commit/da07ba49459f77fe77e3f72555eb50a0cbaab095))
* make isWaitlistOpen optional ([#2809](https://github.com/seanmalbert/bloom/issues/2809)) ([37c5a98](https://github.com/seanmalbert/bloom/commit/37c5a9803d7e88095d36a22c1e4d634b14d5f72a))
* partners render issue ([#2395](https://github.com/seanmalbert/bloom/issues/2395)) ([7fb108d](https://github.com/seanmalbert/bloom/commit/7fb108d744fcafd6b9df42706d2a2f58fbc30f0a))
* patches translations for preferences ([#2410](https://github.com/seanmalbert/bloom/issues/2410)) ([7906e6b](https://github.com/seanmalbert/bloom/commit/7906e6bc035fab4deea79ea51833a0ef29926d45))
* unit accordion radio button not showing default value ([#2451](https://github.com/seanmalbert/bloom/issues/2451)) ([4ed8103](https://github.com/seanmalbert/bloom/commit/4ed81039b9130d0433b11df2bdabc495ce2b9f24))
* units with invalid ami chart ([#2290](https://github.com/seanmalbert/bloom/issues/2290)) ([a6516e1](https://github.com/seanmalbert/bloom/commit/a6516e142ec13db5c3c8d2bb4f726be681e172e3))
* update for subject line ([#2578](https://github.com/seanmalbert/bloom/issues/2578)) ([dace763](https://github.com/seanmalbert/bloom/commit/dace76332bbdb3ad104638f32a07e71fd85edc0c))
* update to mfa text's text ([#2579](https://github.com/seanmalbert/bloom/issues/2579)) ([ac5b812](https://github.com/seanmalbert/bloom/commit/ac5b81242f3177de09ed176a60f06be871906178))
* updates partner check for listing perm ([#2484](https://github.com/seanmalbert/bloom/issues/2484)) ([9b0a6f5](https://github.com/seanmalbert/bloom/commit/9b0a6f560ec5dd95f846b330afb71eed40cbfa1b))


### Code Refactoring

* remove backend dependencies from events components, consolidate ([#2495](https://github.com/seanmalbert/bloom/issues/2495)) ([d884689](https://github.com/seanmalbert/bloom/commit/d88468965bc67c74b8b3eaced20c77472e90331f))


* 2022-07-26 release (#2916) ([af8d3df](https://github.com/seanmalbert/bloom/commit/af8d3dfc1974878cc21500272405ef5046dcfb50)), closes [#2916](https://github.com/seanmalbert/bloom/issues/2916) [#2821](https://github.com/seanmalbert/bloom/issues/2821) [#2764](https://github.com/seanmalbert/bloom/issues/2764) [#2767](https://github.com/seanmalbert/bloom/issues/2767) [#2787](https://github.com/seanmalbert/bloom/issues/2787) [#2769](https://github.com/seanmalbert/bloom/issues/2769) [#2781](https://github.com/seanmalbert/bloom/issues/2781) [#2827](https://github.com/seanmalbert/bloom/issues/2827) [Issue#2827](https://github.com/Issue/issues/2827) [#2788](https://github.com/seanmalbert/bloom/issues/2788) [#2842](https://github.com/seanmalbert/bloom/issues/2842) [#2822](https://github.com/seanmalbert/bloom/issues/2822) [#2847](https://github.com/seanmalbert/bloom/issues/2847) [#2830](https://github.com/seanmalbert/bloom/issues/2830) [#2788](https://github.com/seanmalbert/bloom/issues/2788) [#2842](https://github.com/seanmalbert/bloom/issues/2842) [#2827](https://github.com/seanmalbert/bloom/issues/2827) [Issue#2827](https://github.com/Issue/issues/2827) [#2822](https://github.com/seanmalbert/bloom/issues/2822) [#2846](https://github.com/seanmalbert/bloom/issues/2846) [#2851](https://github.com/seanmalbert/bloom/issues/2851) [#2594](https://github.com/seanmalbert/bloom/issues/2594) [#2812](https://github.com/seanmalbert/bloom/issues/2812) [#2799](https://github.com/seanmalbert/bloom/issues/2799) [#2828](https://github.com/seanmalbert/bloom/issues/2828) [#2843](https://github.com/seanmalbert/bloom/issues/2843) [#2827](https://github.com/seanmalbert/bloom/issues/2827) [#2875](https://github.com/seanmalbert/bloom/issues/2875) [#2859](https://github.com/seanmalbert/bloom/issues/2859) [#2848](https://github.com/seanmalbert/bloom/issues/2848) [#2785](https://github.com/seanmalbert/bloom/issues/2785)
* 2022-06 -16 sync master (#2825) ([17dabfe](https://github.com/seanmalbert/bloom/commit/17dabfeaf77afb55d629f97fe8e90001df94dc04)), closes [#2825](https://github.com/seanmalbert/bloom/issues/2825) [#2753](https://github.com/seanmalbert/bloom/issues/2753) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2505](https://github.com/seanmalbert/bloom/issues/2505) [#2372](https://github.com/seanmalbert/bloom/issues/2372) [#2489](https://github.com/seanmalbert/bloom/issues/2489) [#2497](https://github.com/seanmalbert/bloom/issues/2497) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2486](https://github.com/seanmalbert/bloom/issues/2486)
* 2022 05 24 sync master (#2754) ([f52781f](https://github.com/seanmalbert/bloom/commit/f52781fe18fbdad071d6e9a8a2b29877596c5492)), closes [#2754](https://github.com/seanmalbert/bloom/issues/2754) [#2753](https://github.com/seanmalbert/bloom/issues/2753) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2505](https://github.com/seanmalbert/bloom/issues/2505) [#2372](https://github.com/seanmalbert/bloom/issues/2372) [#2489](https://github.com/seanmalbert/bloom/issues/2489) [#2497](https://github.com/seanmalbert/bloom/issues/2497) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2486](https://github.com/seanmalbert/bloom/issues/2486)
* 2022-04-11 sync master (#2649) ([9d30acf](https://github.com/seanmalbert/bloom/commit/9d30acf7b53fca50a87fc8bd2658c11d3ed37427)), closes [#2649](https://github.com/seanmalbert/bloom/issues/2649) [#2037](https://github.com/seanmalbert/bloom/issues/2037) [#2095](https://github.com/seanmalbert/bloom/issues/2095) [#2162](https://github.com/seanmalbert/bloom/issues/2162) [#2293](https://github.com/seanmalbert/bloom/issues/2293) [#2295](https://github.com/seanmalbert/bloom/issues/2295) [#2296](https://github.com/seanmalbert/bloom/issues/2296) [#2294](https://github.com/seanmalbert/bloom/issues/2294) [#2277](https://github.com/seanmalbert/bloom/issues/2277) [#2299](https://github.com/seanmalbert/bloom/issues/2299) [#2292](https://github.com/seanmalbert/bloom/issues/2292) [#2308](https://github.com/seanmalbert/bloom/issues/2308) [#2239](https://github.com/seanmalbert/bloom/issues/2239) [#2311](https://github.com/seanmalbert/bloom/issues/2311) [#2230](https://github.com/seanmalbert/bloom/issues/2230) [#2302](https://github.com/seanmalbert/bloom/issues/2302) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2215](https://github.com/seanmalbert/bloom/issues/2215) [#2303](https://github.com/seanmalbert/bloom/issues/2303) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2439](https://github.com/seanmalbert/bloom/issues/2439) [#2196](https://github.com/seanmalbert/bloom/issues/2196) [#2238](https://github.com/seanmalbert/bloom/issues/2238) [#2226](https://github.com/seanmalbert/bloom/issues/2226) [#2230](https://github.com/seanmalbert/bloom/issues/2230) [#2243](https://github.com/seanmalbert/bloom/issues/2243) [#2195](https://github.com/seanmalbert/bloom/issues/2195) [#2215](https://github.com/seanmalbert/bloom/issues/2215) [#2266](https://github.com/seanmalbert/bloom/issues/2266) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2270](https://github.com/seanmalbert/bloom/issues/2270) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2213](https://github.com/seanmalbert/bloom/issues/2213) [#2234](https://github.com/seanmalbert/bloom/issues/2234) [#1901](https://github.com/seanmalbert/bloom/issues/1901) [#2260](https://github.com/seanmalbert/bloom/issues/2260) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2280](https://github.com/seanmalbert/bloom/issues/2280) [#2253](https://github.com/seanmalbert/bloom/issues/2253) [#2276](https://github.com/seanmalbert/bloom/issues/2276) [#2282](https://github.com/seanmalbert/bloom/issues/2282) [#2262](https://github.com/seanmalbert/bloom/issues/2262) [#2278](https://github.com/seanmalbert/bloom/issues/2278) [#2293](https://github.com/seanmalbert/bloom/issues/2293) [#2295](https://github.com/seanmalbert/bloom/issues/2295) [#2296](https://github.com/seanmalbert/bloom/issues/2296) [#2294](https://github.com/seanmalbert/bloom/issues/2294) [#2277](https://github.com/seanmalbert/bloom/issues/2277) [#2290](https://github.com/seanmalbert/bloom/issues/2290) [#2299](https://github.com/seanmalbert/bloom/issues/2299) [#2292](https://github.com/seanmalbert/bloom/issues/2292) [#2303](https://github.com/seanmalbert/bloom/issues/2303) [#2305](https://github.com/seanmalbert/bloom/issues/2305) [#2306](https://github.com/seanmalbert/bloom/issues/2306) [#2308](https://github.com/seanmalbert/bloom/issues/2308) [#2190](https://github.com/seanmalbert/bloom/issues/2190) [#2239](https://github.com/seanmalbert/bloom/issues/2239) [#2311](https://github.com/seanmalbert/bloom/issues/2311) [#2302](https://github.com/seanmalbert/bloom/issues/2302) [#2301](https://github.com/seanmalbert/bloom/issues/2301) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2313](https://github.com/seanmalbert/bloom/issues/2313) [#2289](https://github.com/seanmalbert/bloom/issues/2289) [#2279](https://github.com/seanmalbert/bloom/issues/2279) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2519](https://github.com/seanmalbert/bloom/issues/2519) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2534](https://github.com/seanmalbert/bloom/issues/2534) [#2544](https://github.com/seanmalbert/bloom/issues/2544) [#2550](https://github.com/seanmalbert/bloom/issues/2550) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2438](https://github.com/seanmalbert/bloom/issues/2438) [#2429](https://github.com/seanmalbert/bloom/issues/2429) [#2452](https://github.com/seanmalbert/bloom/issues/2452) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2423](https://github.com/seanmalbert/bloom/issues/2423) [#2432](https://github.com/seanmalbert/bloom/issues/2432) [#2437](https://github.com/seanmalbert/bloom/issues/2437) [#2440](https://github.com/seanmalbert/bloom/issues/2440) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2505](https://github.com/seanmalbert/bloom/issues/2505) [#2372](https://github.com/seanmalbert/bloom/issues/2372) [#2489](https://github.com/seanmalbert/bloom/issues/2489) [#2497](https://github.com/seanmalbert/bloom/issues/2497) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2486](https://github.com/seanmalbert/bloom/issues/2486)
* 2022-04-06 sync master (#2628) ([bc31833](https://github.com/seanmalbert/bloom/commit/bc31833f7ea5720a242d93a01bb1b539181fbad4)), closes [#2628](https://github.com/seanmalbert/bloom/issues/2628) [#2037](https://github.com/seanmalbert/bloom/issues/2037) [#2095](https://github.com/seanmalbert/bloom/issues/2095) [#2162](https://github.com/seanmalbert/bloom/issues/2162) [#2293](https://github.com/seanmalbert/bloom/issues/2293) [#2295](https://github.com/seanmalbert/bloom/issues/2295) [#2296](https://github.com/seanmalbert/bloom/issues/2296) [#2294](https://github.com/seanmalbert/bloom/issues/2294) [#2277](https://github.com/seanmalbert/bloom/issues/2277) [#2299](https://github.com/seanmalbert/bloom/issues/2299) [#2292](https://github.com/seanmalbert/bloom/issues/2292) [#2308](https://github.com/seanmalbert/bloom/issues/2308) [#2239](https://github.com/seanmalbert/bloom/issues/2239) [#2311](https://github.com/seanmalbert/bloom/issues/2311) [#2230](https://github.com/seanmalbert/bloom/issues/2230) [#2302](https://github.com/seanmalbert/bloom/issues/2302) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2215](https://github.com/seanmalbert/bloom/issues/2215) [#2303](https://github.com/seanmalbert/bloom/issues/2303) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2439](https://github.com/seanmalbert/bloom/issues/2439) [#2196](https://github.com/seanmalbert/bloom/issues/2196) [#2238](https://github.com/seanmalbert/bloom/issues/2238) [#2226](https://github.com/seanmalbert/bloom/issues/2226) [#2230](https://github.com/seanmalbert/bloom/issues/2230) [#2243](https://github.com/seanmalbert/bloom/issues/2243) [#2195](https://github.com/seanmalbert/bloom/issues/2195) [#2215](https://github.com/seanmalbert/bloom/issues/2215) [#2266](https://github.com/seanmalbert/bloom/issues/2266) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2270](https://github.com/seanmalbert/bloom/issues/2270) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2213](https://github.com/seanmalbert/bloom/issues/2213) [#2234](https://github.com/seanmalbert/bloom/issues/2234) [#1901](https://github.com/seanmalbert/bloom/issues/1901) [#2260](https://github.com/seanmalbert/bloom/issues/2260) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2280](https://github.com/seanmalbert/bloom/issues/2280) [#2253](https://github.com/seanmalbert/bloom/issues/2253) [#2276](https://github.com/seanmalbert/bloom/issues/2276) [#2282](https://github.com/seanmalbert/bloom/issues/2282) [#2262](https://github.com/seanmalbert/bloom/issues/2262) [#2278](https://github.com/seanmalbert/bloom/issues/2278) [#2293](https://github.com/seanmalbert/bloom/issues/2293) [#2295](https://github.com/seanmalbert/bloom/issues/2295) [#2296](https://github.com/seanmalbert/bloom/issues/2296) [#2294](https://github.com/seanmalbert/bloom/issues/2294) [#2277](https://github.com/seanmalbert/bloom/issues/2277) [#2290](https://github.com/seanmalbert/bloom/issues/2290) [#2299](https://github.com/seanmalbert/bloom/issues/2299) [#2292](https://github.com/seanmalbert/bloom/issues/2292) [#2303](https://github.com/seanmalbert/bloom/issues/2303) [#2305](https://github.com/seanmalbert/bloom/issues/2305) [#2306](https://github.com/seanmalbert/bloom/issues/2306) [#2308](https://github.com/seanmalbert/bloom/issues/2308) [#2190](https://github.com/seanmalbert/bloom/issues/2190) [#2239](https://github.com/seanmalbert/bloom/issues/2239) [#2311](https://github.com/seanmalbert/bloom/issues/2311) [#2302](https://github.com/seanmalbert/bloom/issues/2302) [#2301](https://github.com/seanmalbert/bloom/issues/2301) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2313](https://github.com/seanmalbert/bloom/issues/2313) [#2289](https://github.com/seanmalbert/bloom/issues/2289) [#2279](https://github.com/seanmalbert/bloom/issues/2279) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2519](https://github.com/seanmalbert/bloom/issues/2519) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2534](https://github.com/seanmalbert/bloom/issues/2534) [#2544](https://github.com/seanmalbert/bloom/issues/2544) [#2550](https://github.com/seanmalbert/bloom/issues/2550) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2438](https://github.com/seanmalbert/bloom/issues/2438) [#2429](https://github.com/seanmalbert/bloom/issues/2429) [#2452](https://github.com/seanmalbert/bloom/issues/2452) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2423](https://github.com/seanmalbert/bloom/issues/2423) [#2432](https://github.com/seanmalbert/bloom/issues/2432) [#2437](https://github.com/seanmalbert/bloom/issues/2437) [#2440](https://github.com/seanmalbert/bloom/issues/2440) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2505](https://github.com/seanmalbert/bloom/issues/2505) [#2372](https://github.com/seanmalbert/bloom/issues/2372) [#2489](https://github.com/seanmalbert/bloom/issues/2489) [#2497](https://github.com/seanmalbert/bloom/issues/2497) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2486](https://github.com/seanmalbert/bloom/issues/2486)


### Features

* add accessibility building features to listing ([#2755](https://github.com/seanmalbert/bloom/issues/2755)) ([0c8dfb8](https://github.com/seanmalbert/bloom/commit/0c8dfb833d0ef6d4f4927636c9f01bae6f48e4f1))
* add settings page to partners ([#2789](https://github.com/seanmalbert/bloom/issues/2789)) ([3869946](https://github.com/seanmalbert/bloom/commit/3869946a016510f53b20854a06c5f32187c4de79))
* adds NULLS LAST to mostRecentlyClosed ([#2521](https://github.com/seanmalbert/bloom/issues/2521)) ([39737a3](https://github.com/seanmalbert/bloom/commit/39737a3207e22815d184fc19cb2eaf6b6390dda8))
* adds partners re-request confirmation ([#2574](https://github.com/seanmalbert/bloom/issues/2574)) ([235af78](https://github.com/seanmalbert/bloom/commit/235af781914e5c36104bb3862dd55152a16e6750)), closes [#2577](https://github.com/seanmalbert/bloom/issues/2577)
* adds whatToExpect to GTrans ([#2303](https://github.com/seanmalbert/bloom/issues/2303)) ([6d7305b](https://github.com/seanmalbert/bloom/commit/6d7305b8e3b7e1c3a9776123e8e6d370ab803af0))
* **backend:** add activity logging to listings module ([#2190](https://github.com/seanmalbert/bloom/issues/2190)) ([88d60e3](https://github.com/seanmalbert/bloom/commit/88d60e32d77381d6e830158ce77c058b1cfcc022))
* **backend:** add appropriate http exception for password outdated login failure ([e5df66e](https://github.com/seanmalbert/bloom/commit/e5df66e4fe0f937f507d014f3b25c6c9b4b5deff))
* **backend:** add jurisdiction default rental assistance text ([#2604](https://github.com/seanmalbert/bloom/issues/2604)) ([00b684c](https://github.com/seanmalbert/bloom/commit/00b684cd8b8b1f9ef201b8aec78c13572a4125a5))
* **backend:** add listing order by mostRecentlyClosed param ([#2478](https://github.com/seanmalbert/bloom/issues/2478)) ([0f177c1](https://github.com/seanmalbert/bloom/commit/0f177c1847ac254f63837b0aca7fa8a705e3632c))
* **backend:** add listings closing routine ([#2213](https://github.com/seanmalbert/bloom/issues/2213)) ([a747806](https://github.com/seanmalbert/bloom/commit/a747806282f80c92bd9a171a2b4d5c9b74d3b49a))
* **backend:** add order param to listings GET endpoint ([#2630](https://github.com/seanmalbert/bloom/issues/2630)) ([2a915f2](https://github.com/seanmalbert/bloom/commit/2a915f2bb0d07fb20e2c829896fa22a13e4da1bf))
* **backend:** add partners portal users multi factor authentication ([#2291](https://github.com/seanmalbert/bloom/issues/2291)) ([5b10098](https://github.com/seanmalbert/bloom/commit/5b10098d8668f9f42c60e90236db16d6cc517793)), closes [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485)
* **backend:** add partnerTerms to jurisdiction entity ([#2301](https://github.com/seanmalbert/bloom/issues/2301)) ([7ecf3ef](https://github.com/seanmalbert/bloom/commit/7ecf3ef24f261bf6b42fc38cf0080251a3c60e89))
* **backend:** add password outdating only to users which are either admins or partners ([754546d](https://github.com/seanmalbert/bloom/commit/754546dfd5194f8c30e12963031791818566d22d))
* **backend:** add publishedAt and closedAt to listing entity ([#2432](https://github.com/seanmalbert/bloom/issues/2432)) ([f3b0f86](https://github.com/seanmalbert/bloom/commit/f3b0f864a6d5d2ad3d886e828743454c3e8fca71))
* **backend:** add search param to GET /user/list endpoint ([#2714](https://github.com/seanmalbert/bloom/issues/2714)) ([95c9a68](https://github.com/seanmalbert/bloom/commit/95c9a6838f534450c0da6919064f4a799898ed8f))
* **backend:** add storing listing translations ([#2215](https://github.com/seanmalbert/bloom/issues/2215)) ([6ac63ea](https://github.com/seanmalbert/bloom/commit/6ac63eae82e14ab32d541b907c7e5dc800c1971f))
* **backend:** add user password expiration ([107c2f0](https://github.com/seanmalbert/bloom/commit/107c2f06e2f8367b52cb7cc8f00e6d9aef751fe0))
* **backend:** all programs to csv export ([#2302](https://github.com/seanmalbert/bloom/issues/2302)) ([f4d6a62](https://github.com/seanmalbert/bloom/commit/f4d6a62920e3b859310898e3a040f8116b43cab3))
* **backend:** fix translations table relation to jurisdiction (make … ([#2506](https://github.com/seanmalbert/bloom/issues/2506)) ([8e1e3a9](https://github.com/seanmalbert/bloom/commit/8e1e3a9eb0ff76412831e122390ac25ad7754645))
* **backend:** improve ami chart dto definitions ([#2677](https://github.com/seanmalbert/bloom/issues/2677)) ([ca3890e](https://github.com/seanmalbert/bloom/commit/ca3890e2759f230824e31e6bd985300f40b0a0ed))
* **backend:** improve user queries ([#2676](https://github.com/seanmalbert/bloom/issues/2676)) ([4733e8a](https://github.com/seanmalbert/bloom/commit/4733e8a9909e47bb2522f9b319f45fe25923cdb5))
* **backend:** lock failed login attempts ([a8370ce](https://github.com/seanmalbert/bloom/commit/a8370ce1516f75180796d190a9a9f2697723e181))
* **backend:** make listing image an array ([#2477](https://github.com/seanmalbert/bloom/issues/2477)) ([cab9800](https://github.com/seanmalbert/bloom/commit/cab98003e640c880be2218fa42321eadeec35e9c))
* **backend:** refactor applications module ([#2279](https://github.com/seanmalbert/bloom/issues/2279)) ([e0b4523](https://github.com/seanmalbert/bloom/commit/e0b4523817c7d3863c3802d8a9f61d1a1c8685d4))
* **backend:** remove activity log interceptor from update-password ([2e56b98](https://github.com/seanmalbert/bloom/commit/2e56b9878969604bec2f7694a83dbf7061af9df2))
* **backend:** remove assigning partner user as an application owner ([#2476](https://github.com/seanmalbert/bloom/issues/2476)) ([4f6edf7](https://github.com/seanmalbert/bloom/commit/4f6edf7ed882ae926e363e4db4e40e6f19ed4746))
* creating setting wall for accessibility feat ([#2817](https://github.com/seanmalbert/bloom/issues/2817)) ([d26cad4](https://github.com/seanmalbert/bloom/commit/d26cad463daf45995e5ed887a0132063d56c0ab5))
* load overly to partner listings grid ([#2621](https://github.com/seanmalbert/bloom/issues/2621)) ([4785f34](https://github.com/seanmalbert/bloom/commit/4785f344831f97dac2164224e32247619e5ac808))
* outdated password messaging updates ([b14e19d](https://github.com/seanmalbert/bloom/commit/b14e19d43099af2ba721d8aaaeeb2be886d05111))
* overrides fallback to english, tagalog support ([#2262](https://github.com/seanmalbert/bloom/issues/2262)) ([679ab9b](https://github.com/seanmalbert/bloom/commit/679ab9b1816d5934f48f02ca5f5696952ef88ae7))
* removes ListingLangCacheInterceptor from get by id ([7acbd82](https://github.com/seanmalbert/bloom/commit/7acbd82485edfa9a8aa5a82473d5bbe5cee571e7))
* updates to mfa styling ([#2532](https://github.com/seanmalbert/bloom/issues/2532)) ([7654efc](https://github.com/seanmalbert/bloom/commit/7654efc8a7c5cba0f7436fda62b886f646fe8a03))


### Performance Improvements

* user list and user getQb ([#2756](https://github.com/seanmalbert/bloom/issues/2756)) ([bc45879](https://github.com/seanmalbert/bloom/commit/bc45879f79934b5a1cf48a4d6a911048906e3184))


### BREAKING CHANGES

* prop name change for header from "text" to "content"

* chore(release): version

 - @bloom-housing/shared-helpers@5.0.1-alpha.2
 - @bloom-housing/partners@5.0.1-alpha.2
 - @bloom-housing/public@5.0.1-alpha.2
 - @bloom-housing/ui-components@5.0.1-alpha.1
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* preferences model and relationships changed

* feat: feat(backend): extend UserUpdateDto to support email change

picked from dev 3e1fdbd0ea91d4773973d5c485a5ba61303db90a

* fix: 2056/user account edit fix

picked from dev a15618c0cb548ff5b2ae913b802c9e08bb673f30

* refactor: 2085/adds top level catchAll exception filter

picked from dev aeaa63d1af1fa3d11671e169cb3bd23d356fface

* feat: feat: Change unit number field type to text

picked from dev f54be7c7ba6aac8e00fee610dc86584b60cc212d

* feat(backend): improve application flagged set saving efficiency

* fix: fix: updates address order

picked from dev 252e014dcbd2e4c305384ed552135f5a8e4e4767

* fix: sets programs to optoinal and updates versions

* chore: chore(deps): bump electron from 13.1.7 to 13.3.0

* chore: chore(deps): bump axios from 0.21.1 to 0.21.2

* fix: adds programs service

* fix: fix lisitng e2e tests

* fix: fix member tests

* fix: adds jurisdictionId to useSWR path

* fix: recalculate units available on listing update

picked form dev f1a3dbce6478b16542ed61ab20de5dfb9b797262

* feat: feat(backend): make use of new application confirmation codes

picked from dev 3c45c2904818200eed4568931d4cc352fd2f449e

* revert: revert "chore(deps): bump axios from 0.21.1 to 0.21.2

picked from dev 2b83bc0393afc42eed542e326d5ef75502ce119c

* fix: app submission w/ no due date

picked from dev 4af1f5a8448f16d347b4a65ecb85fda4d6ed71fc

* feat: adds new preferences, reserved community type

* feat: adds bottom border to preferences

* feat: updates preference string

* fix: preference cleanup for avance

* refactor: remove applicationAddress

picked from dev bf10632a62bf2f14922948c046ea3352ed010f4f

* feat: refactor and add public site application flow cypress tests

picked from dev 9ec0e8d05f9570773110754e7fdaf49254d1eab8

* feat: better seed data for ami-charts

picked from dev d8b1d4d185731a589c563a32bd592d01537785f3

* feat: adds listing management cypress tests to partner portal

* fix: listings management keep empty strings, remove empty objects

picked from dev c4b1e833ec128f457015ac7ffa421ee6047083d9

* feat: one month rent

picked from dev 883b0d53030e1c4d54f2f75bd5e188bb1d255f64

* test: view.spec.ts test

picked from dev 324446c90138d8fac50aba445f515009b5a58bfb

* refactor: removes jsonpath

picked from dev deb39acc005607ce3076942b1f49590d08afc10c

* feat: adds jurisdictions to pref seeds

picked from dev 9e47cec3b1acfe769207ccbb33c07019cd742e33

* feat: new demographics sub-race questions

picked from dev 9ab892694c1ad2fa8890b411b3b32af68ade1fc3

* feat: updates email confirmation for lottery

picked from dev 1a5e824c96d8e23674c32ea92688b9f7255528d3

* fix: add ariaHidden to Icon component

picked from dev c7bb86aec6fd5ad386c7ca50087d0113b14503be

* fix: add ariaLabel prop to Button component

picked from dev 509ddc898ba44c05e26f8ed8c777f1ba456eeee5

* fix: change the yes/no radio text to be more descriptive

picked from dev 0c46054574535523d6f217bb0677bbe732b8945f

* fix: remove alameda reference in demographics

picked from dev 7d5991cbf6dbe0b61f2b14d265e87ce3687f743d

* chore: release version

picked from dev fe82f25dc349877d974ae62d228fea0354978fb7

* feat: ami chart jurisdictionalized

picked from dev 0a5cbc88a9d9e3c2ff716fe0f44ca6c48f5dcc50

* refactor: make backend a peer dependency in ui-components

picked from dev 952aaa14a77e0960312ff0eeee51399d1d6af9f3

* feat: add a phone number column to the user_accounts table

picked from dev 2647df9ab9888a525cc8a164d091dda6482c502a

* chore: removes application program partners

* chore: removes application program display

* Revert "chore: removes application program display"

This reverts commit 14825b4a6c9cd1a7235e32074e32af18a71b5c26.

* Revert "chore: removes application program partners"

This reverts commit d7aa38c777972a2e21d9f816441caa27f98d3f86.

* chore: yarn.lock and backend-swagger

* fix: removes Duplicate identifier fieldGroupObjectToArray

* feat: skip preferences if not on listing

* chore(release): version

* fix: cannot save custom mailing, dropoff, or pickup address

* chore(release): version

* chore: converge on one axios version, remove peer dependency

* chore(release): version

* feat: simplify Waitlist component and use more flexible schema

* chore(release): version

* fix: lottery results uploads now save

* chore(release): version

* feat: add SRO unit type

* chore(release): version

* fix: paper application submission

* chore(release): version

* fix: choose-language context

* chore(release): version

* fix: applications/view hide prefs

* chore(release): version

* feat: overrides fallback to english, tagalog support

* chore(release): version

* fix: account translations

* chore(release): version

* fix: units with invalid ami chart

* chore(release): version

* fix: remove description for the partners programs

* fix: fix modal styles on mobile

* fix: visual improvement to programs form display

* fix: submission tests not running
* sign-in pages have been updated
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* preferences model and relationships changed

* feat: feat(backend): extend UserUpdateDto to support email change

picked from dev 3e1fdbd0ea91d4773973d5c485a5ba61303db90a

* fix: 2056/user account edit fix

picked from dev a15618c0cb548ff5b2ae913b802c9e08bb673f30

* refactor: 2085/adds top level catchAll exception filter

picked from dev aeaa63d1af1fa3d11671e169cb3bd23d356fface

* feat: feat: Change unit number field type to text

picked from dev f54be7c7ba6aac8e00fee610dc86584b60cc212d

* feat(backend): improve application flagged set saving efficiency

* fix: fix: updates address order

picked from dev 252e014dcbd2e4c305384ed552135f5a8e4e4767

* fix: sets programs to optoinal and updates versions

* chore: chore(deps): bump electron from 13.1.7 to 13.3.0

* chore: chore(deps): bump axios from 0.21.1 to 0.21.2

* fix: adds programs service

* fix: fix lisitng e2e tests

* fix: fix member tests

* fix: adds jurisdictionId to useSWR path

* fix: recalculate units available on listing update

picked form dev f1a3dbce6478b16542ed61ab20de5dfb9b797262

* feat: feat(backend): make use of new application confirmation codes

picked from dev 3c45c2904818200eed4568931d4cc352fd2f449e

* revert: revert "chore(deps): bump axios from 0.21.1 to 0.21.2

picked from dev 2b83bc0393afc42eed542e326d5ef75502ce119c

* fix: app submission w/ no due date

picked from dev 4af1f5a8448f16d347b4a65ecb85fda4d6ed71fc

* feat: adds new preferences, reserved community type

* feat: adds bottom border to preferences

* feat: updates preference string

* fix: preference cleanup for avance

* refactor: remove applicationAddress

picked from dev bf10632a62bf2f14922948c046ea3352ed010f4f

* feat: refactor and add public site application flow cypress tests

picked from dev 9ec0e8d05f9570773110754e7fdaf49254d1eab8

* feat: better seed data for ami-charts

picked from dev d8b1d4d185731a589c563a32bd592d01537785f3

* feat: adds listing management cypress tests to partner portal

* fix: listings management keep empty strings, remove empty objects

picked from dev c4b1e833ec128f457015ac7ffa421ee6047083d9

* feat: one month rent

picked from dev 883b0d53030e1c4d54f2f75bd5e188bb1d255f64

* test: view.spec.ts test

picked from dev 324446c90138d8fac50aba445f515009b5a58bfb

* refactor: removes jsonpath

picked from dev deb39acc005607ce3076942b1f49590d08afc10c

* feat: adds jurisdictions to pref seeds

picked from dev 9e47cec3b1acfe769207ccbb33c07019cd742e33

* feat: new demographics sub-race questions

picked from dev 9ab892694c1ad2fa8890b411b3b32af68ade1fc3

* feat: updates email confirmation for lottery

picked from dev 1a5e824c96d8e23674c32ea92688b9f7255528d3

* fix: add ariaHidden to Icon component

picked from dev c7bb86aec6fd5ad386c7ca50087d0113b14503be

* fix: add ariaLabel prop to Button component

picked from dev 509ddc898ba44c05e26f8ed8c777f1ba456eeee5

* fix: change the yes/no radio text to be more descriptive

picked from dev 0c46054574535523d6f217bb0677bbe732b8945f

* fix: remove alameda reference in demographics

picked from dev 7d5991cbf6dbe0b61f2b14d265e87ce3687f743d

* chore: release version

picked from dev fe82f25dc349877d974ae62d228fea0354978fb7

* feat: ami chart jurisdictionalized

picked from dev 0a5cbc88a9d9e3c2ff716fe0f44ca6c48f5dcc50

* refactor: make backend a peer dependency in ui-components

picked from dev 952aaa14a77e0960312ff0eeee51399d1d6af9f3

* feat: add a phone number column to the user_accounts table

picked from dev 2647df9ab9888a525cc8a164d091dda6482c502a

* chore: removes application program partners

* chore: removes application program display

* Revert "chore: removes application program display"

This reverts commit 14825b4a6c9cd1a7235e32074e32af18a71b5c26.

* Revert "chore: removes application program partners"

This reverts commit d7aa38c777972a2e21d9f816441caa27f98d3f86.

* chore: yarn.lock and backend-swagger

* fix: removes Duplicate identifier fieldGroupObjectToArray

* feat: skip preferences if not on listing

* chore(release): version

* fix: cannot save custom mailing, dropoff, or pickup address

* chore(release): version

* chore: converge on one axios version, remove peer dependency

* chore(release): version

* feat: simplify Waitlist component and use more flexible schema

* chore(release): version

* fix: lottery results uploads now save

* chore(release): version

* feat: add SRO unit type

* chore(release): version

* fix: paper application submission

* chore(release): version

* fix: choose-language context

* chore(release): version

* fix: applications/view hide prefs

* chore(release): version

* feat: overrides fallback to english, tagalog support

* chore(release): version

* fix: account translations

* chore(release): version

* fix: units with invalid ami chart

* chore(release): version

* fix: remove description for the partners programs

* fix: fix modal styles on mobile

* fix: visual improvement to programs form display

* fix: submission tests not running
* sign-in pages have been updated
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection
* remove applicationDueTime field and consolidated into applicationDueDate





## [5.0.1-alpha.15](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.14...@bloom-housing/backend-core@5.0.1-alpha.15) (2022-07-27)


### Bug Fixes

* preview and juri admin perms for user access ([#2914](https://github.com/bloom-housing/bloom/issues/2914)) ([2db1fdb](https://github.com/bloom-housing/bloom/commit/2db1fdba2fcb366acfc436c3f58b1651550d2367))





## [5.0.1-alpha.14](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.13...@bloom-housing/backend-core@5.0.1-alpha.14) (2022-07-26)

**Note:** Version bump only for package @bloom-housing/backend-core





## [5.0.1-alpha.13](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.12...@bloom-housing/backend-core@5.0.1-alpha.13) (2022-07-26)

**Note:** Version bump only for package @bloom-housing/backend-core





## [5.0.1-alpha.12](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.11...@bloom-housing/backend-core@5.0.1-alpha.12) (2022-07-19)


### Features

* visuals for add preference, preference option drawers ([#2877](https://github.com/bloom-housing/bloom/issues/2877)) ([8611034](https://github.com/bloom-housing/bloom/commit/8611034845b45ce4d4e4eb44e790ac2adec0ba94))





## [5.0.1-alpha.11](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.10...@bloom-housing/backend-core@5.0.1-alpha.11) (2022-07-15)


### Features

* creating users as admin ([#2856](https://github.com/bloom-housing/bloom/issues/2856)) ([dd946d1](https://github.com/bloom-housing/bloom/commit/dd946d1777b4678e89832da527768180f474d129))





## [5.0.1-alpha.10](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.9...@bloom-housing/backend-core@5.0.1-alpha.10) (2022-07-13)


### Features

* **backend:** refactor listings query building ([#2855](https://github.com/bloom-housing/bloom/issues/2855)) ([2888d11](https://github.com/bloom-housing/bloom/commit/2888d118c51307a885e6fc0d424eab7940d21b3d))





## [5.0.1-alpha.9](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.8...@bloom-housing/backend-core@5.0.1-alpha.9) (2022-07-12)

**Note:** Version bump only for package @bloom-housing/backend-core





## [5.0.1-alpha.8](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.7...@bloom-housing/backend-core@5.0.1-alpha.8) (2022-07-11)


### Bug Fixes

* fix email from address ([#2875](https://github.com/bloom-housing/bloom/issues/2875)) ([ea69c92](https://github.com/bloom-housing/bloom/commit/ea69c9201cf7b3d57b8751bf1c0d3662f2d991aa))





## [5.0.1-alpha.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.6...@bloom-housing/backend-core@5.0.1-alpha.7) (2022-07-08)

**Note:** Version bump only for package @bloom-housing/backend-core





## [5.0.1-alpha.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.5...@bloom-housing/backend-core@5.0.1-alpha.6) (2022-07-07)


### Features

* populate jurisdictional preferences on settings page ([#2828](https://github.com/bloom-housing/bloom/issues/2828)) ([2ea5646](https://github.com/bloom-housing/bloom/commit/2ea5646a49dc6782fe0e83e942e1917929fde153))





## [5.0.1-alpha.5](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.4...@bloom-housing/backend-core@5.0.1-alpha.5) (2022-07-06)

**Note:** Version bump only for package @bloom-housing/backend-core





## [5.0.1-alpha.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.3...@bloom-housing/backend-core@5.0.1-alpha.4) (2022-07-06)

**Note:** Version bump only for package @bloom-housing/backend-core





## [5.0.1-alpha.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.2...@bloom-housing/backend-core@5.0.1-alpha.3) (2022-06-29)

**Note:** Version bump only for package @bloom-housing/backend-core





## [5.0.1-alpha.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.1...@bloom-housing/backend-core@5.0.1-alpha.2) (2022-06-22)


### Features

* **backend:** add jurisdictional admin relation ([#2764](https://github.com/bloom-housing/bloom/issues/2764)) ([8f951f9](https://github.com/bloom-housing/bloom/commit/8f951f9a4239bb5aad179cc5567f208d34533a45)), closes [#2767](https://github.com/bloom-housing/bloom/issues/2767) [#2787](https://github.com/bloom-housing/bloom/issues/2787) [#2769](https://github.com/bloom-housing/bloom/issues/2769) [#2781](https://github.com/bloom-housing/bloom/issues/2781)





## [5.0.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@5.0.1-alpha.0...@bloom-housing/backend-core@5.0.1-alpha.1) (2022-06-17)

**Note:** Version bump only for package @bloom-housing/backend-core





## [5.0.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.13...@bloom-housing/backend-core@5.0.1-alpha.0) (2022-06-16)


* 2022-06 -16 sync master (#2825) ([17dabfe](https://github.com/bloom-housing/bloom/commit/17dabfeaf77afb55d629f97fe8e90001df94dc04)), closes [#2825](https://github.com/bloom-housing/bloom/issues/2825) [#2753](https://github.com/bloom-housing/bloom/issues/2753) [#2441](https://github.com/bloom-housing/bloom/issues/2441) [#2460](https://github.com/bloom-housing/bloom/issues/2460) [#2459](https://github.com/bloom-housing/bloom/issues/2459) [#2464](https://github.com/bloom-housing/bloom/issues/2464) [#2465](https://github.com/bloom-housing/bloom/issues/2465) [#2466](https://github.com/bloom-housing/bloom/issues/2466) [#2436](https://github.com/bloom-housing/bloom/issues/2436) [#2451](https://github.com/bloom-housing/bloom/issues/2451) [#2415](https://github.com/bloom-housing/bloom/issues/2415) [#2354](https://github.com/bloom-housing/bloom/issues/2354) [#2455](https://github.com/bloom-housing/bloom/issues/2455) [#2484](https://github.com/bloom-housing/bloom/issues/2484) [#2482](https://github.com/bloom-housing/bloom/issues/2482) [#2483](https://github.com/bloom-housing/bloom/issues/2483) [#2476](https://github.com/bloom-housing/bloom/issues/2476) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2470](https://github.com/bloom-housing/bloom/issues/2470) [#2488](https://github.com/bloom-housing/bloom/issues/2488) [#2487](https://github.com/bloom-housing/bloom/issues/2487) [#2496](https://github.com/bloom-housing/bloom/issues/2496) [#2498](https://github.com/bloom-housing/bloom/issues/2498) [#2499](https://github.com/bloom-housing/bloom/issues/2499) [#2291](https://github.com/bloom-housing/bloom/issues/2291) [#2461](https://github.com/bloom-housing/bloom/issues/2461) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2494](https://github.com/bloom-housing/bloom/issues/2494) [#2503](https://github.com/bloom-housing/bloom/issues/2503) [#2495](https://github.com/bloom-housing/bloom/issues/2495) [#2477](https://github.com/bloom-housing/bloom/issues/2477) [#2505](https://github.com/bloom-housing/bloom/issues/2505) [#2372](https://github.com/bloom-housing/bloom/issues/2372) [#2489](https://github.com/bloom-housing/bloom/issues/2489) [#2497](https://github.com/bloom-housing/bloom/issues/2497) [#2506](https://github.com/bloom-housing/bloom/issues/2506) [#2486](https://github.com/bloom-housing/bloom/issues/2486)


### BREAKING CHANGES

* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62





# [5.0.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@4.4.0...@bloom-housing/backend-core@5.0.0) (2022-06-16)


* 2022-06-16 release (#2824) ([1abd991](https://github.com/seanmalbert/bloom/commit/1abd991136e28598b7856164b88bef462b8ff566)), closes [#2824](https://github.com/seanmalbert/bloom/issues/2824) [#2521](https://github.com/seanmalbert/bloom/issues/2521) [#2504](https://github.com/seanmalbert/bloom/issues/2504) [#2520](https://github.com/seanmalbert/bloom/issues/2520) [#2517](https://github.com/seanmalbert/bloom/issues/2517) [#2519](https://github.com/seanmalbert/bloom/issues/2519) [#2529](https://github.com/seanmalbert/bloom/issues/2529) [#2534](https://github.com/seanmalbert/bloom/issues/2534) [#2540](https://github.com/seanmalbert/bloom/issues/2540) [#2528](https://github.com/seanmalbert/bloom/issues/2528) [#2544](https://github.com/seanmalbert/bloom/issues/2544) [#2545](https://github.com/seanmalbert/bloom/issues/2545) [#2526](https://github.com/seanmalbert/bloom/issues/2526) [#2532](https://github.com/seanmalbert/bloom/issues/2532) [#2551](https://github.com/seanmalbert/bloom/issues/2551) [#2562](https://github.com/seanmalbert/bloom/issues/2562) [#2566](https://github.com/seanmalbert/bloom/issues/2566) [#2572](https://github.com/seanmalbert/bloom/issues/2572) [#2546](https://github.com/seanmalbert/bloom/issues/2546) [#2578](https://github.com/seanmalbert/bloom/issues/2578) [#2579](https://github.com/seanmalbert/bloom/issues/2579) [#2581](https://github.com/seanmalbert/bloom/issues/2581) [#2593](https://github.com/seanmalbert/bloom/issues/2593) [#2037](https://github.com/seanmalbert/bloom/issues/2037) [#2095](https://github.com/seanmalbert/bloom/issues/2095) [#2162](https://github.com/seanmalbert/bloom/issues/2162) [#2293](https://github.com/seanmalbert/bloom/issues/2293) [#2295](https://github.com/seanmalbert/bloom/issues/2295) [#2296](https://github.com/seanmalbert/bloom/issues/2296) [#2294](https://github.com/seanmalbert/bloom/issues/2294) [#2277](https://github.com/seanmalbert/bloom/issues/2277) [#2299](https://github.com/seanmalbert/bloom/issues/2299) [#2292](https://github.com/seanmalbert/bloom/issues/2292) [#2308](https://github.com/seanmalbert/bloom/issues/2308) [#2239](https://github.com/seanmalbert/bloom/issues/2239) [#2311](https://github.com/seanmalbert/bloom/issues/2311) [#2230](https://github.com/seanmalbert/bloom/issues/2230) [#2302](https://github.com/seanmalbert/bloom/issues/2302) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2215](https://github.com/seanmalbert/bloom/issues/2215) [#2303](https://github.com/seanmalbert/bloom/issues/2303) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2439](https://github.com/seanmalbert/bloom/issues/2439) [#2196](https://github.com/seanmalbert/bloom/issues/2196) [#2238](https://github.com/seanmalbert/bloom/issues/2238) [#2226](https://github.com/seanmalbert/bloom/issues/2226) [#2230](https://github.com/seanmalbert/bloom/issues/2230) [#2243](https://github.com/seanmalbert/bloom/issues/2243) [#2195](https://github.com/seanmalbert/bloom/issues/2195) [#2215](https://github.com/seanmalbert/bloom/issues/2215) [#2266](https://github.com/seanmalbert/bloom/issues/2266) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2270](https://github.com/seanmalbert/bloom/issues/2270) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2213](https://github.com/seanmalbert/bloom/issues/2213) [#2234](https://github.com/seanmalbert/bloom/issues/2234) [#1901](https://github.com/seanmalbert/bloom/issues/1901) [#2260](https://github.com/seanmalbert/bloom/issues/2260) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2280](https://github.com/seanmalbert/bloom/issues/2280) [#2253](https://github.com/seanmalbert/bloom/issues/2253) [#2276](https://github.com/seanmalbert/bloom/issues/2276) [#2282](https://github.com/seanmalbert/bloom/issues/2282) [#2262](https://github.com/seanmalbert/bloom/issues/2262) [#2278](https://github.com/seanmalbert/bloom/issues/2278) [#2293](https://github.com/seanmalbert/bloom/issues/2293) [#2295](https://github.com/seanmalbert/bloom/issues/2295) [#2296](https://github.com/seanmalbert/bloom/issues/2296) [#2294](https://github.com/seanmalbert/bloom/issues/2294) [#2277](https://github.com/seanmalbert/bloom/issues/2277) [#2290](https://github.com/seanmalbert/bloom/issues/2290) [#2299](https://github.com/seanmalbert/bloom/issues/2299) [#2292](https://github.com/seanmalbert/bloom/issues/2292) [#2303](https://github.com/seanmalbert/bloom/issues/2303) [#2305](https://github.com/seanmalbert/bloom/issues/2305) [#2306](https://github.com/seanmalbert/bloom/issues/2306) [#2308](https://github.com/seanmalbert/bloom/issues/2308) [#2190](https://github.com/seanmalbert/bloom/issues/2190) [#2239](https://github.com/seanmalbert/bloom/issues/2239) [#2311](https://github.com/seanmalbert/bloom/issues/2311) [#2302](https://github.com/seanmalbert/bloom/issues/2302) [#2301](https://github.com/seanmalbert/bloom/issues/2301) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2313](https://github.com/seanmalbert/bloom/issues/2313) [#2289](https://github.com/seanmalbert/bloom/issues/2289) [#2279](https://github.com/seanmalbert/bloom/issues/2279) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2519](https://github.com/seanmalbert/bloom/issues/2519) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2534](https://github.com/seanmalbert/bloom/issues/2534) [#2544](https://github.com/seanmalbert/bloom/issues/2544) [#2550](https://github.com/seanmalbert/bloom/issues/2550) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2438](https://github.com/seanmalbert/bloom/issues/2438) [#2429](https://github.com/seanmalbert/bloom/issues/2429) [#2452](https://github.com/seanmalbert/bloom/issues/2452) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2423](https://github.com/seanmalbert/bloom/issues/2423) [#2432](https://github.com/seanmalbert/bloom/issues/2432) [#2437](https://github.com/seanmalbert/bloom/issues/2437) [#2440](https://github.com/seanmalbert/bloom/issues/2440) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2574](https://github.com/seanmalbert/bloom/issues/2574) [#2577](https://github.com/seanmalbert/bloom/issues/2577) [#2590](https://github.com/seanmalbert/bloom/issues/2590) [#2592](https://github.com/seanmalbert/bloom/issues/2592) [#2560](https://github.com/seanmalbert/bloom/issues/2560) [#2501](https://github.com/seanmalbert/bloom/issues/2501) [#2501](https://github.com/seanmalbert/bloom/issues/2501) [#2501](https://github.com/seanmalbert/bloom/issues/2501) [#2501](https://github.com/seanmalbert/bloom/issues/2501) [#2501](https://github.com/seanmalbert/bloom/issues/2501) [#2501](https://github.com/seanmalbert/bloom/issues/2501) [#2501](https://github.com/seanmalbert/bloom/issues/2501) [#2501](https://github.com/seanmalbert/bloom/issues/2501) [#2501](https://github.com/seanmalbert/bloom/issues/2501) [#2599](https://github.com/seanmalbert/bloom/issues/2599) [#2600](https://github.com/seanmalbert/bloom/issues/2600) [#2598](https://github.com/seanmalbert/bloom/issues/2598) [#2582](https://github.com/seanmalbert/bloom/issues/2582) [#2531](https://github.com/seanmalbert/bloom/issues/2531) [#2615](https://github.com/seanmalbert/bloom/issues/2615) [#2606](https://github.com/seanmalbert/bloom/issues/2606) [#2618](https://github.com/seanmalbert/bloom/issues/2618) [#2620](https://github.com/seanmalbert/bloom/issues/2620) [#2628](https://github.com/seanmalbert/bloom/issues/2628) [#2037](https://github.com/seanmalbert/bloom/issues/2037) [#2095](https://github.com/seanmalbert/bloom/issues/2095) [#2162](https://github.com/seanmalbert/bloom/issues/2162) [#2293](https://github.com/seanmalbert/bloom/issues/2293) [#2295](https://github.com/seanmalbert/bloom/issues/2295) [#2296](https://github.com/seanmalbert/bloom/issues/2296) [#2294](https://github.com/seanmalbert/bloom/issues/2294) [#2277](https://github.com/seanmalbert/bloom/issues/2277) [#2299](https://github.com/seanmalbert/bloom/issues/2299) [#2292](https://github.com/seanmalbert/bloom/issues/2292) [#2308](https://github.com/seanmalbert/bloom/issues/2308) [#2239](https://github.com/seanmalbert/bloom/issues/2239) [#2311](https://github.com/seanmalbert/bloom/issues/2311) [#2230](https://github.com/seanmalbert/bloom/issues/2230) [#2302](https://github.com/seanmalbert/bloom/issues/2302) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2215](https://github.com/seanmalbert/bloom/issues/2215) [#2303](https://github.com/seanmalbert/bloom/issues/2303) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2439](https://github.com/seanmalbert/bloom/issues/2439) [#2196](https://github.com/seanmalbert/bloom/issues/2196) [#2238](https://github.com/seanmalbert/bloom/issues/2238) [#2226](https://github.com/seanmalbert/bloom/issues/2226) [#2230](https://github.com/seanmalbert/bloom/issues/2230) [#2243](https://github.com/seanmalbert/bloom/issues/2243) [#2195](https://github.com/seanmalbert/bloom/issues/2195) [#2215](https://github.com/seanmalbert/bloom/issues/2215) [#2266](https://github.com/seanmalbert/bloom/issues/2266) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2270](https://github.com/seanmalbert/bloom/issues/2270) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2213](https://github.com/seanmalbert/bloom/issues/2213) [#2234](https://github.com/seanmalbert/bloom/issues/2234) [#1901](https://github.com/seanmalbert/bloom/issues/1901) [#2260](https://github.com/seanmalbert/bloom/issues/2260) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2280](https://github.com/seanmalbert/bloom/issues/2280) [#2253](https://github.com/seanmalbert/bloom/issues/2253) [#2276](https://github.com/seanmalbert/bloom/issues/2276) [#2282](https://github.com/seanmalbert/bloom/issues/2282) [#2262](https://github.com/seanmalbert/bloom/issues/2262) [#2278](https://github.com/seanmalbert/bloom/issues/2278) [#2293](https://github.com/seanmalbert/bloom/issues/2293) [#2295](https://github.com/seanmalbert/bloom/issues/2295) [#2296](https://github.com/seanmalbert/bloom/issues/2296) [#2294](https://github.com/seanmalbert/bloom/issues/2294) [#2277](https://github.com/seanmalbert/bloom/issues/2277) [#2290](https://github.com/seanmalbert/bloom/issues/2290) [#2299](https://github.com/seanmalbert/bloom/issues/2299) [#2292](https://github.com/seanmalbert/bloom/issues/2292) [#2303](https://github.com/seanmalbert/bloom/issues/2303) [#2305](https://github.com/seanmalbert/bloom/issues/2305) [#2306](https://github.com/seanmalbert/bloom/issues/2306) [#2308](https://github.com/seanmalbert/bloom/issues/2308) [#2190](https://github.com/seanmalbert/bloom/issues/2190) [#2239](https://github.com/seanmalbert/bloom/issues/2239) [#2311](https://github.com/seanmalbert/bloom/issues/2311) [#2302](https://github.com/seanmalbert/bloom/issues/2302) [#2301](https://github.com/seanmalbert/bloom/issues/2301) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2313](https://github.com/seanmalbert/bloom/issues/2313) [#2289](https://github.com/seanmalbert/bloom/issues/2289) [#2279](https://github.com/seanmalbert/bloom/issues/2279) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2519](https://github.com/seanmalbert/bloom/issues/2519) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2534](https://github.com/seanmalbert/bloom/issues/2534) [#2544](https://github.com/seanmalbert/bloom/issues/2544) [#2550](https://github.com/seanmalbert/bloom/issues/2550) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2438](https://github.com/seanmalbert/bloom/issues/2438) [#2429](https://github.com/seanmalbert/bloom/issues/2429) [#2452](https://github.com/seanmalbert/bloom/issues/2452) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2423](https://github.com/seanmalbert/bloom/issues/2423) [#2432](https://github.com/seanmalbert/bloom/issues/2432) [#2437](https://github.com/seanmalbert/bloom/issues/2437) [#2440](https://github.com/seanmalbert/bloom/issues/2440) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2563](https://github.com/seanmalbert/bloom/issues/2563) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2537](https://github.com/seanmalbert/bloom/issues/2537) [#2635](https://github.com/seanmalbert/bloom/issues/2635) [#2624](https://github.com/seanmalbert/bloom/issues/2624) [#2642](https://github.com/seanmalbert/bloom/issues/2642) [#2652](https://github.com/seanmalbert/bloom/issues/2652) [#2649](https://github.com/seanmalbert/bloom/issues/2649) [#2037](https://github.com/seanmalbert/bloom/issues/2037) [#2095](https://github.com/seanmalbert/bloom/issues/2095) [#2162](https://github.com/seanmalbert/bloom/issues/2162) [#2293](https://github.com/seanmalbert/bloom/issues/2293) [#2295](https://github.com/seanmalbert/bloom/issues/2295) [#2296](https://github.com/seanmalbert/bloom/issues/2296) [#2294](https://github.com/seanmalbert/bloom/issues/2294) [#2277](https://github.com/seanmalbert/bloom/issues/2277) [#2299](https://github.com/seanmalbert/bloom/issues/2299) [#2292](https://github.com/seanmalbert/bloom/issues/2292) [#2308](https://github.com/seanmalbert/bloom/issues/2308) [#2239](https://github.com/seanmalbert/bloom/issues/2239) [#2311](https://github.com/seanmalbert/bloom/issues/2311) [#2230](https://github.com/seanmalbert/bloom/issues/2230) [#2302](https://github.com/seanmalbert/bloom/issues/2302) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2215](https://github.com/seanmalbert/bloom/issues/2215) [#2303](https://github.com/seanmalbert/bloom/issues/2303) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2439](https://github.com/seanmalbert/bloom/issues/2439) [#2196](https://github.com/seanmalbert/bloom/issues/2196) [#2238](https://github.com/seanmalbert/bloom/issues/2238) [#2226](https://github.com/seanmalbert/bloom/issues/2226) [#2230](https://github.com/seanmalbert/bloom/issues/2230) [#2243](https://github.com/seanmalbert/bloom/issues/2243) [#2195](https://github.com/seanmalbert/bloom/issues/2195) [#2215](https://github.com/seanmalbert/bloom/issues/2215) [#2266](https://github.com/seanmalbert/bloom/issues/2266) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2270](https://github.com/seanmalbert/bloom/issues/2270) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2213](https://github.com/seanmalbert/bloom/issues/2213) [#2234](https://github.com/seanmalbert/bloom/issues/2234) [#1901](https://github.com/seanmalbert/bloom/issues/1901) [#2260](https://github.com/seanmalbert/bloom/issues/2260) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2280](https://github.com/seanmalbert/bloom/issues/2280) [#2253](https://github.com/seanmalbert/bloom/issues/2253) [#2276](https://github.com/seanmalbert/bloom/issues/2276) [#2282](https://github.com/seanmalbert/bloom/issues/2282) [#2262](https://github.com/seanmalbert/bloom/issues/2262) [#2278](https://github.com/seanmalbert/bloom/issues/2278) [#2293](https://github.com/seanmalbert/bloom/issues/2293) [#2295](https://github.com/seanmalbert/bloom/issues/2295) [#2296](https://github.com/seanmalbert/bloom/issues/2296) [#2294](https://github.com/seanmalbert/bloom/issues/2294) [#2277](https://github.com/seanmalbert/bloom/issues/2277) [#2290](https://github.com/seanmalbert/bloom/issues/2290) [#2299](https://github.com/seanmalbert/bloom/issues/2299) [#2292](https://github.com/seanmalbert/bloom/issues/2292) [#2303](https://github.com/seanmalbert/bloom/issues/2303) [#2305](https://github.com/seanmalbert/bloom/issues/2305) [#2306](https://github.com/seanmalbert/bloom/issues/2306) [#2308](https://github.com/seanmalbert/bloom/issues/2308) [#2190](https://github.com/seanmalbert/bloom/issues/2190) [#2239](https://github.com/seanmalbert/bloom/issues/2239) [#2311](https://github.com/seanmalbert/bloom/issues/2311) [#2302](https://github.com/seanmalbert/bloom/issues/2302) [#2301](https://github.com/seanmalbert/bloom/issues/2301) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2313](https://github.com/seanmalbert/bloom/issues/2313) [#2289](https://github.com/seanmalbert/bloom/issues/2289) [#2279](https://github.com/seanmalbert/bloom/issues/2279) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2519](https://github.com/seanmalbert/bloom/issues/2519) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2534](https://github.com/seanmalbert/bloom/issues/2534) [#2544](https://github.com/seanmalbert/bloom/issues/2544) [#2550](https://github.com/seanmalbert/bloom/issues/2550) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2438](https://github.com/seanmalbert/bloom/issues/2438) [#2429](https://github.com/seanmalbert/bloom/issues/2429) [#2452](https://github.com/seanmalbert/bloom/issues/2452) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2423](https://github.com/seanmalbert/bloom/issues/2423) [#2432](https://github.com/seanmalbert/bloom/issues/2432) [#2437](https://github.com/seanmalbert/bloom/issues/2437) [#2440](https://github.com/seanmalbert/bloom/issues/2440) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2658](https://github.com/seanmalbert/bloom/issues/2658) [#2653](https://github.com/seanmalbert/bloom/issues/2653) [#2630](https://github.com/seanmalbert/bloom/issues/2630) [#2612](https://github.com/seanmalbert/bloom/issues/2612) [#2672](https://github.com/seanmalbert/bloom/issues/2672) [#2558](https://github.com/seanmalbert/bloom/issues/2558) [#2604](https://github.com/seanmalbert/bloom/issues/2604) [#2625](https://github.com/seanmalbert/bloom/issues/2625) [#2650](https://github.com/seanmalbert/bloom/issues/2650) [#2481](https://github.com/seanmalbert/bloom/issues/2481) [#2481](https://github.com/seanmalbert/bloom/issues/2481) [#2481](https://github.com/seanmalbert/bloom/issues/2481) [#2481](https://github.com/seanmalbert/bloom/issues/2481) [#2481](https://github.com/seanmalbert/bloom/issues/2481) [#2481](https://github.com/seanmalbert/bloom/issues/2481) [#2603](https://github.com/seanmalbert/bloom/issues/2603) [#2648](https://github.com/seanmalbert/bloom/issues/2648) [#2673](https://github.com/seanmalbert/bloom/issues/2673) [#2661](https://github.com/seanmalbert/bloom/issues/2661) [#2676](https://github.com/seanmalbert/bloom/issues/2676) [#2680](https://github.com/seanmalbert/bloom/issues/2680) [#2597](https://github.com/seanmalbert/bloom/issues/2597) [#2686](https://github.com/seanmalbert/bloom/issues/2686) [#2683](https://github.com/seanmalbert/bloom/issues/2683) [#2657](https://github.com/seanmalbert/bloom/issues/2657) [#2693](https://github.com/seanmalbert/bloom/issues/2693) [#2694](https://github.com/seanmalbert/bloom/issues/2694) [#2616](https://github.com/seanmalbert/bloom/issues/2616) [#2703](https://github.com/seanmalbert/bloom/issues/2703) [#2697](https://github.com/seanmalbert/bloom/issues/2697) [#2691](https://github.com/seanmalbert/bloom/issues/2691) [#2687](https://github.com/seanmalbert/bloom/issues/2687) [#2700](https://github.com/seanmalbert/bloom/issues/2700) [#2677](https://github.com/seanmalbert/bloom/issues/2677) [#2682](https://github.com/seanmalbert/bloom/issues/2682) [#2689](https://github.com/seanmalbert/bloom/issues/2689) [#2675](https://github.com/seanmalbert/bloom/issues/2675) [#2713](https://github.com/seanmalbert/bloom/issues/2713) [#2702](https://github.com/seanmalbert/bloom/issues/2702) [#2704](https://github.com/seanmalbert/bloom/issues/2704) [#2719](https://github.com/seanmalbert/bloom/issues/2719) [#2714](https://github.com/seanmalbert/bloom/issues/2714) [#2543](https://github.com/seanmalbert/bloom/issues/2543) [#2728](https://github.com/seanmalbert/bloom/issues/2728) [#2692](https://github.com/seanmalbert/bloom/issues/2692) [#2732](https://github.com/seanmalbert/bloom/issues/2732) [#2749](https://github.com/seanmalbert/bloom/issues/2749) [#2744](https://github.com/seanmalbert/bloom/issues/2744) [#2754](https://github.com/seanmalbert/bloom/issues/2754) [#2753](https://github.com/seanmalbert/bloom/issues/2753) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2505](https://github.com/seanmalbert/bloom/issues/2505) [#2372](https://github.com/seanmalbert/bloom/issues/2372) [#2489](https://github.com/seanmalbert/bloom/issues/2489) [#2497](https://github.com/seanmalbert/bloom/issues/2497) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2486](https://github.com/seanmalbert/bloom/issues/2486)


### Performance Improvements

* user list and user getQb ([#2756](https://github.com/seanmalbert/bloom/issues/2756)) ([cd02be3](https://github.com/seanmalbert/bloom/commit/cd02be32f10560978a786abaf752ace7c32f5b0e))


### BREAKING CHANGES

* preferences model and relationships changed

* feat: feat(backend): extend UserUpdateDto to support email change

picked from dev 3e1fdbd0ea91d4773973d5c485a5ba61303db90a

* fix: 2056/user account edit fix

picked from dev a15618c0cb548ff5b2ae913b802c9e08bb673f30

* refactor: 2085/adds top level catchAll exception filter

picked from dev aeaa63d1af1fa3d11671e169cb3bd23d356fface

* feat: feat: Change unit number field type to text

picked from dev f54be7c7ba6aac8e00fee610dc86584b60cc212d

* feat(backend): improve application flagged set saving efficiency

* fix: fix: updates address order

picked from dev 252e014dcbd2e4c305384ed552135f5a8e4e4767

* fix: sets programs to optoinal and updates versions

* chore: chore(deps): bump electron from 13.1.7 to 13.3.0

* chore: chore(deps): bump axios from 0.21.1 to 0.21.2

* fix: adds programs service

* fix: fix lisitng e2e tests

* fix: fix member tests

* fix: adds jurisdictionId to useSWR path

* fix: recalculate units available on listing update

picked form dev f1a3dbce6478b16542ed61ab20de5dfb9b797262

* feat: feat(backend): make use of new application confirmation codes

picked from dev 3c45c2904818200eed4568931d4cc352fd2f449e

* revert: revert "chore(deps): bump axios from 0.21.1 to 0.21.2

picked from dev 2b83bc0393afc42eed542e326d5ef75502ce119c

* fix: app submission w/ no due date

picked from dev 4af1f5a8448f16d347b4a65ecb85fda4d6ed71fc

* feat: adds new preferences, reserved community type

* feat: adds bottom border to preferences

* feat: updates preference string

* fix: preference cleanup for avance

* refactor: remove applicationAddress

picked from dev bf10632a62bf2f14922948c046ea3352ed010f4f

* feat: refactor and add public site application flow cypress tests

picked from dev 9ec0e8d05f9570773110754e7fdaf49254d1eab8

* feat: better seed data for ami-charts

picked from dev d8b1d4d185731a589c563a32bd592d01537785f3

* feat: adds listing management cypress tests to partner portal

* fix: listings management keep empty strings, remove empty objects

picked from dev c4b1e833ec128f457015ac7ffa421ee6047083d9

* feat: one month rent

picked from dev 883b0d53030e1c4d54f2f75bd5e188bb1d255f64

* test: view.spec.ts test

picked from dev 324446c90138d8fac50aba445f515009b5a58bfb

* refactor: removes jsonpath

picked from dev deb39acc005607ce3076942b1f49590d08afc10c

* feat: adds jurisdictions to pref seeds

picked from dev 9e47cec3b1acfe769207ccbb33c07019cd742e33

* feat: new demographics sub-race questions

picked from dev 9ab892694c1ad2fa8890b411b3b32af68ade1fc3

* feat: updates email confirmation for lottery

picked from dev 1a5e824c96d8e23674c32ea92688b9f7255528d3

* fix: add ariaHidden to Icon component

picked from dev c7bb86aec6fd5ad386c7ca50087d0113b14503be

* fix: add ariaLabel prop to Button component

picked from dev 509ddc898ba44c05e26f8ed8c777f1ba456eeee5

* fix: change the yes/no radio text to be more descriptive

picked from dev 0c46054574535523d6f217bb0677bbe732b8945f

* fix: remove alameda reference in demographics

picked from dev 7d5991cbf6dbe0b61f2b14d265e87ce3687f743d

* chore: release version

picked from dev fe82f25dc349877d974ae62d228fea0354978fb7

* feat: ami chart jurisdictionalized

picked from dev 0a5cbc88a9d9e3c2ff716fe0f44ca6c48f5dcc50

* refactor: make backend a peer dependency in ui-components

picked from dev 952aaa14a77e0960312ff0eeee51399d1d6af9f3

* feat: add a phone number column to the user_accounts table

picked from dev 2647df9ab9888a525cc8a164d091dda6482c502a

* chore: removes application program partners

* chore: removes application program display

* Revert "chore: removes application program display"

This reverts commit 14825b4a6c9cd1a7235e32074e32af18a71b5c26.

* Revert "chore: removes application program partners"

This reverts commit d7aa38c777972a2e21d9f816441caa27f98d3f86.

* chore: yarn.lock and backend-swagger

* fix: removes Duplicate identifier fieldGroupObjectToArray

* feat: skip preferences if not on listing

* chore(release): version

* fix: cannot save custom mailing, dropoff, or pickup address

* chore(release): version

* chore: converge on one axios version, remove peer dependency

* chore(release): version

* feat: simplify Waitlist component and use more flexible schema

* chore(release): version

* fix: lottery results uploads now save

* chore(release): version

* feat: add SRO unit type

* chore(release): version

* fix: paper application submission

* chore(release): version

* fix: choose-language context

* chore(release): version

* fix: applications/view hide prefs

* chore(release): version

* feat: overrides fallback to english, tagalog support

* chore(release): version

* fix: account translations

* chore(release): version

* fix: units with invalid ami chart

* chore(release): version

* fix: remove description for the partners programs

* fix: fix modal styles on mobile

* fix: visual improvement to programs form display

* fix: submission tests not running
* sign-in pages have been updated
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* preferences model and relationships changed

* feat: feat(backend): extend UserUpdateDto to support email change

picked from dev 3e1fdbd0ea91d4773973d5c485a5ba61303db90a

* fix: 2056/user account edit fix

picked from dev a15618c0cb548ff5b2ae913b802c9e08bb673f30

* refactor: 2085/adds top level catchAll exception filter

picked from dev aeaa63d1af1fa3d11671e169cb3bd23d356fface

* feat: feat: Change unit number field type to text

picked from dev f54be7c7ba6aac8e00fee610dc86584b60cc212d

* feat(backend): improve application flagged set saving efficiency

* fix: fix: updates address order

picked from dev 252e014dcbd2e4c305384ed552135f5a8e4e4767

* fix: sets programs to optoinal and updates versions

* chore: chore(deps): bump electron from 13.1.7 to 13.3.0

* chore: chore(deps): bump axios from 0.21.1 to 0.21.2

* fix: adds programs service

* fix: fix lisitng e2e tests

* fix: fix member tests

* fix: adds jurisdictionId to useSWR path

* fix: recalculate units available on listing update

picked form dev f1a3dbce6478b16542ed61ab20de5dfb9b797262

* feat: feat(backend): make use of new application confirmation codes

picked from dev 3c45c2904818200eed4568931d4cc352fd2f449e

* revert: revert "chore(deps): bump axios from 0.21.1 to 0.21.2

picked from dev 2b83bc0393afc42eed542e326d5ef75502ce119c

* fix: app submission w/ no due date

picked from dev 4af1f5a8448f16d347b4a65ecb85fda4d6ed71fc

* feat: adds new preferences, reserved community type

* feat: adds bottom border to preferences

* feat: updates preference string

* fix: preference cleanup for avance

* refactor: remove applicationAddress

picked from dev bf10632a62bf2f14922948c046ea3352ed010f4f

* feat: refactor and add public site application flow cypress tests

picked from dev 9ec0e8d05f9570773110754e7fdaf49254d1eab8

* feat: better seed data for ami-charts

picked from dev d8b1d4d185731a589c563a32bd592d01537785f3

* feat: adds listing management cypress tests to partner portal

* fix: listings management keep empty strings, remove empty objects

picked from dev c4b1e833ec128f457015ac7ffa421ee6047083d9

* feat: one month rent

picked from dev 883b0d53030e1c4d54f2f75bd5e188bb1d255f64

* test: view.spec.ts test

picked from dev 324446c90138d8fac50aba445f515009b5a58bfb

* refactor: removes jsonpath

picked from dev deb39acc005607ce3076942b1f49590d08afc10c

* feat: adds jurisdictions to pref seeds

picked from dev 9e47cec3b1acfe769207ccbb33c07019cd742e33

* feat: new demographics sub-race questions

picked from dev 9ab892694c1ad2fa8890b411b3b32af68ade1fc3

* feat: updates email confirmation for lottery

picked from dev 1a5e824c96d8e23674c32ea92688b9f7255528d3

* fix: add ariaHidden to Icon component

picked from dev c7bb86aec6fd5ad386c7ca50087d0113b14503be

* fix: add ariaLabel prop to Button component

picked from dev 509ddc898ba44c05e26f8ed8c777f1ba456eeee5

* fix: change the yes/no radio text to be more descriptive

picked from dev 0c46054574535523d6f217bb0677bbe732b8945f

* fix: remove alameda reference in demographics

picked from dev 7d5991cbf6dbe0b61f2b14d265e87ce3687f743d

* chore: release version

picked from dev fe82f25dc349877d974ae62d228fea0354978fb7

* feat: ami chart jurisdictionalized

picked from dev 0a5cbc88a9d9e3c2ff716fe0f44ca6c48f5dcc50

* refactor: make backend a peer dependency in ui-components

picked from dev 952aaa14a77e0960312ff0eeee51399d1d6af9f3

* feat: add a phone number column to the user_accounts table

picked from dev 2647df9ab9888a525cc8a164d091dda6482c502a

* chore: removes application program partners

* chore: removes application program display

* Revert "chore: removes application program display"

This reverts commit 14825b4a6c9cd1a7235e32074e32af18a71b5c26.

* Revert "chore: removes application program partners"

This reverts commit d7aa38c777972a2e21d9f816441caa27f98d3f86.

* chore: yarn.lock and backend-swagger

* fix: removes Duplicate identifier fieldGroupObjectToArray

* feat: skip preferences if not on listing

* chore(release): version

* fix: cannot save custom mailing, dropoff, or pickup address

* chore(release): version

* chore: converge on one axios version, remove peer dependency

* chore(release): version

* feat: simplify Waitlist component and use more flexible schema

* chore(release): version

* fix: lottery results uploads now save

* chore(release): version

* feat: add SRO unit type

* chore(release): version

* fix: paper application submission

* chore(release): version

* fix: choose-language context

* chore(release): version

* fix: applications/view hide prefs

* chore(release): version

* feat: overrides fallback to english, tagalog support

* chore(release): version

* fix: account translations

* chore(release): version

* fix: units with invalid ami chart

* chore(release): version

* fix: remove description for the partners programs

* fix: fix modal styles on mobile

* fix: visual improvement to programs form display

* fix: submission tests not running
* sign-in pages have been updated
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* preferences model and relationships changed

* feat: feat(backend): extend UserUpdateDto to support email change

picked from dev 3e1fdbd0ea91d4773973d5c485a5ba61303db90a

* fix: 2056/user account edit fix

picked from dev a15618c0cb548ff5b2ae913b802c9e08bb673f30

* refactor: 2085/adds top level catchAll exception filter

picked from dev aeaa63d1af1fa3d11671e169cb3bd23d356fface

* feat: feat: Change unit number field type to text

picked from dev f54be7c7ba6aac8e00fee610dc86584b60cc212d

* feat(backend): improve application flagged set saving efficiency

* fix: fix: updates address order

picked from dev 252e014dcbd2e4c305384ed552135f5a8e4e4767

* fix: sets programs to optoinal and updates versions

* chore: chore(deps): bump electron from 13.1.7 to 13.3.0

* chore: chore(deps): bump axios from 0.21.1 to 0.21.2

* fix: adds programs service

* fix: fix lisitng e2e tests

* fix: fix member tests

* fix: adds jurisdictionId to useSWR path

* fix: recalculate units available on listing update

picked form dev f1a3dbce6478b16542ed61ab20de5dfb9b797262

* feat: feat(backend): make use of new application confirmation codes

picked from dev 3c45c2904818200eed4568931d4cc352fd2f449e

* revert: revert "chore(deps): bump axios from 0.21.1 to 0.21.2

picked from dev 2b83bc0393afc42eed542e326d5ef75502ce119c

* fix: app submission w/ no due date

picked from dev 4af1f5a8448f16d347b4a65ecb85fda4d6ed71fc

* feat: adds new preferences, reserved community type

* feat: adds bottom border to preferences

* feat: updates preference string

* fix: preference cleanup for avance

* refactor: remove applicationAddress

picked from dev bf10632a62bf2f14922948c046ea3352ed010f4f

* feat: refactor and add public site application flow cypress tests

picked from dev 9ec0e8d05f9570773110754e7fdaf49254d1eab8

* feat: better seed data for ami-charts

picked from dev d8b1d4d185731a589c563a32bd592d01537785f3

* feat: adds listing management cypress tests to partner portal

* fix: listings management keep empty strings, remove empty objects

picked from dev c4b1e833ec128f457015ac7ffa421ee6047083d9

* feat: one month rent

picked from dev 883b0d53030e1c4d54f2f75bd5e188bb1d255f64

* test: view.spec.ts test

picked from dev 324446c90138d8fac50aba445f515009b5a58bfb

* refactor: removes jsonpath

picked from dev deb39acc005607ce3076942b1f49590d08afc10c

* feat: adds jurisdictions to pref seeds

picked from dev 9e47cec3b1acfe769207ccbb33c07019cd742e33

* feat: new demographics sub-race questions

picked from dev 9ab892694c1ad2fa8890b411b3b32af68ade1fc3

* feat: updates email confirmation for lottery

picked from dev 1a5e824c96d8e23674c32ea92688b9f7255528d3

* fix: add ariaHidden to Icon component

picked from dev c7bb86aec6fd5ad386c7ca50087d0113b14503be

* fix: add ariaLabel prop to Button component

picked from dev 509ddc898ba44c05e26f8ed8c777f1ba456eeee5

* fix: change the yes/no radio text to be more descriptive

picked from dev 0c46054574535523d6f217bb0677bbe732b8945f

* fix: remove alameda reference in demographics

picked from dev 7d5991cbf6dbe0b61f2b14d265e87ce3687f743d

* chore: release version

picked from dev fe82f25dc349877d974ae62d228fea0354978fb7

* feat: ami chart jurisdictionalized

picked from dev 0a5cbc88a9d9e3c2ff716fe0f44ca6c48f5dcc50

* refactor: make backend a peer dependency in ui-components

picked from dev 952aaa14a77e0960312ff0eeee51399d1d6af9f3

* feat: add a phone number column to the user_accounts table

picked from dev 2647df9ab9888a525cc8a164d091dda6482c502a

* chore: removes application program partners

* chore: removes application program display

* Revert "chore: removes application program display"

This reverts commit 14825b4a6c9cd1a7235e32074e32af18a71b5c26.

* Revert "chore: removes application program partners"

This reverts commit d7aa38c777972a2e21d9f816441caa27f98d3f86.

* chore: yarn.lock and backend-swagger

* fix: removes Duplicate identifier fieldGroupObjectToArray

* feat: skip preferences if not on listing

* chore(release): version

* fix: cannot save custom mailing, dropoff, or pickup address

* chore(release): version

* chore: converge on one axios version, remove peer dependency

* chore(release): version

* feat: simplify Waitlist component and use more flexible schema

* chore(release): version

* fix: lottery results uploads now save

* chore(release): version

* feat: add SRO unit type

* chore(release): version

* fix: paper application submission

* chore(release): version

* fix: choose-language context

* chore(release): version

* fix: applications/view hide prefs

* chore(release): version

* feat: overrides fallback to english, tagalog support

* chore(release): version

* fix: account translations

* chore(release): version

* fix: units with invalid ami chart

* chore(release): version

* fix: remove description for the partners programs

* fix: fix modal styles on mobile

* fix: visual improvement to programs form display

* fix: submission tests not running
* sign-in pages have been updated
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* There is a new prop interface for the StandardTable component and all components that use it, which includes passing cell content within a new object, allowing us to support new cell options - all tables will need to pass data with the new format.

* chore(release): version

 - @bloom-housing/shared-helpers@4.2.2-alpha.10
 - @bloom-housing/partners@4.2.2-alpha.11
 - @bloom-housing/public@4.2.2-alpha.11
 - @bloom-housing/ui-components@4.2.2-alpha.10
* the Waitlist component was renamed to QuantityRowSection which also has a new prop set to account for a flexible number of rows and strings

* chore(release): version

 - @bloom-housing/shared-helpers@4.2.2-alpha.23
 - @bloom-housing/partners@4.2.2-alpha.27
 - @bloom-housing/public@4.2.2-alpha.26
 - @bloom-housing/ui-components@4.2.2-alpha.23
* the LeasingAgent component has been renamed to Contact with a new generalized prop set, the SidebarAddress component has been renamed to ContactAddress with a new generalized prop set

* chore(release): version

 - @bloom-housing/shared-helpers@4.2.2-alpha.24
 - @bloom-housing/partners@4.2.2-alpha.28
 - @bloom-housing/public@4.2.2-alpha.27
 - @bloom-housing/ui-components@4.2.2-alpha.24
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62





## [4.4.1-alpha.13](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.12...@bloom-housing/backend-core@4.4.1-alpha.13) (2022-06-16)


### Features

* creating setting wall for accessibility feat ([#2817](https://github.com/bloom-housing/bloom/issues/2817)) ([d26cad4](https://github.com/bloom-housing/bloom/commit/d26cad463daf45995e5ed887a0132063d56c0ab5))





## [4.4.1-alpha.12](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.11...@bloom-housing/backend-core@4.4.1-alpha.12) (2022-06-13)


### Bug Fixes

* make isWaitlistOpen optional ([#2809](https://github.com/bloom-housing/bloom/issues/2809)) ([37c5a98](https://github.com/bloom-housing/bloom/commit/37c5a9803d7e88095d36a22c1e4d634b14d5f72a))





## [4.4.1-alpha.11](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.10...@bloom-housing/backend-core@4.4.1-alpha.11) (2022-06-09)


### Features

* add settings page to partners ([#2789](https://github.com/bloom-housing/bloom/issues/2789)) ([3869946](https://github.com/bloom-housing/bloom/commit/3869946a016510f53b20854a06c5f32187c4de79))





## [4.4.1-alpha.10](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.9...@bloom-housing/backend-core@4.4.1-alpha.10) (2022-06-03)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.4.1-alpha.9](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.8...@bloom-housing/backend-core@4.4.1-alpha.9) (2022-06-02)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.4.1-alpha.8](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.7...@bloom-housing/backend-core@4.4.1-alpha.8) (2022-06-01)


### Features

* add accessibility building features to listing ([#2755](https://github.com/bloom-housing/bloom/issues/2755)) ([0c8dfb8](https://github.com/bloom-housing/bloom/commit/0c8dfb833d0ef6d4f4927636c9f01bae6f48e4f1))





## [4.4.1-alpha.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.6...@bloom-housing/backend-core@4.4.1-alpha.7) (2022-05-31)


### Features

* load overly to partner listings grid ([#2621](https://github.com/bloom-housing/bloom/issues/2621)) ([4785f34](https://github.com/bloom-housing/bloom/commit/4785f344831f97dac2164224e32247619e5ac808))





## [4.4.1-alpha.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.5...@bloom-housing/backend-core@4.4.1-alpha.6) (2022-05-31)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.4.1-alpha.5](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.4...@bloom-housing/backend-core@4.4.1-alpha.5) (2022-05-31)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.4.1-alpha.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.3...@bloom-housing/backend-core@4.4.1-alpha.4) (2022-05-26)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.4.1-alpha.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.2...@bloom-housing/backend-core@4.4.1-alpha.3) (2022-05-25)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.4.1-alpha.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.1...@bloom-housing/backend-core@4.4.1-alpha.2) (2022-05-25)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.4.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.4.1-alpha.0...@bloom-housing/backend-core@4.4.1-alpha.1) (2022-05-25)


### Performance Improvements

* user list and user getQb ([#2756](https://github.com/bloom-housing/bloom/issues/2756)) ([bc45879](https://github.com/bloom-housing/bloom/commit/bc45879f79934b5a1cf48a4d6a911048906e3184))





## [4.4.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.3.1-alpha.1...@bloom-housing/backend-core@4.4.1-alpha.0) (2022-05-25)


* 2022 05 24 sync master (#2754) ([f52781f](https://github.com/bloom-housing/bloom/commit/f52781fe18fbdad071d6e9a8a2b29877596c5492)), closes [#2754](https://github.com/bloom-housing/bloom/issues/2754) [#2753](https://github.com/bloom-housing/bloom/issues/2753) [#2441](https://github.com/bloom-housing/bloom/issues/2441) [#2460](https://github.com/bloom-housing/bloom/issues/2460) [#2459](https://github.com/bloom-housing/bloom/issues/2459) [#2464](https://github.com/bloom-housing/bloom/issues/2464) [#2465](https://github.com/bloom-housing/bloom/issues/2465) [#2466](https://github.com/bloom-housing/bloom/issues/2466) [#2436](https://github.com/bloom-housing/bloom/issues/2436) [#2451](https://github.com/bloom-housing/bloom/issues/2451) [#2415](https://github.com/bloom-housing/bloom/issues/2415) [#2354](https://github.com/bloom-housing/bloom/issues/2354) [#2455](https://github.com/bloom-housing/bloom/issues/2455) [#2484](https://github.com/bloom-housing/bloom/issues/2484) [#2482](https://github.com/bloom-housing/bloom/issues/2482) [#2483](https://github.com/bloom-housing/bloom/issues/2483) [#2476](https://github.com/bloom-housing/bloom/issues/2476) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2470](https://github.com/bloom-housing/bloom/issues/2470) [#2488](https://github.com/bloom-housing/bloom/issues/2488) [#2487](https://github.com/bloom-housing/bloom/issues/2487) [#2496](https://github.com/bloom-housing/bloom/issues/2496) [#2498](https://github.com/bloom-housing/bloom/issues/2498) [#2499](https://github.com/bloom-housing/bloom/issues/2499) [#2291](https://github.com/bloom-housing/bloom/issues/2291) [#2461](https://github.com/bloom-housing/bloom/issues/2461) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2494](https://github.com/bloom-housing/bloom/issues/2494) [#2503](https://github.com/bloom-housing/bloom/issues/2503) [#2495](https://github.com/bloom-housing/bloom/issues/2495) [#2477](https://github.com/bloom-housing/bloom/issues/2477) [#2505](https://github.com/bloom-housing/bloom/issues/2505) [#2372](https://github.com/bloom-housing/bloom/issues/2372) [#2489](https://github.com/bloom-housing/bloom/issues/2489) [#2497](https://github.com/bloom-housing/bloom/issues/2497) [#2506](https://github.com/bloom-housing/bloom/issues/2506) [#2486](https://github.com/bloom-housing/bloom/issues/2486)


### BREAKING CHANGES

* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62





# [4.4.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@4.2.3...@bloom-housing/backend-core@4.4.0) (2022-05-24)


* 2022-05-24 release (#2753) ([3beb6b7](https://github.com/seanmalbert/bloom/commit/3beb6b77f74e51ec37457d4676a1fd01d1304a65)), closes [#2753](https://github.com/seanmalbert/bloom/issues/2753) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2505](https://github.com/seanmalbert/bloom/issues/2505) [#2372](https://github.com/seanmalbert/bloom/issues/2372) [#2489](https://github.com/seanmalbert/bloom/issues/2489) [#2497](https://github.com/seanmalbert/bloom/issues/2497) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2486](https://github.com/seanmalbert/bloom/issues/2486)


### BREAKING CHANGES

* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62





## [4.3.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.3.1-alpha.0...@bloom-housing/backend-core@4.3.1-alpha.1) (2022-05-24)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.3.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.2-alpha.9...@bloom-housing/backend-core@4.3.1-alpha.0) (2022-05-16)


### Bug Fixes

* adds region to user phone # validation ([#2652](https://github.com/bloom-housing/bloom/issues/2652)) ([d3e0c40](https://github.com/bloom-housing/bloom/commit/d3e0c4041d9aba4d703da85596d59ec765ad179a))
* ami charts without all households ([#2430](https://github.com/bloom-housing/bloom/issues/2430)) ([5e18eba](https://github.com/bloom-housing/bloom/commit/5e18eba1d24bff038b192477b72d9d3f1f05a39d))
* app submission w/ no due date ([8e5a81c](https://github.com/bloom-housing/bloom/commit/8e5a81c37c4efc3404e5536bd54c10cd2962bca3))
* authservice.token data null issue ([#2703](https://github.com/bloom-housing/bloom/issues/2703)) ([5430fa2](https://github.com/bloom-housing/bloom/commit/5430fa2802b2590c7514f228c200ae040eccf403))
* await casbin enforcer ([d7eb196](https://github.com/bloom-housing/bloom/commit/d7eb196be0b05732325938e2db7b583d66cbc9cf))
* cannot save custom mailing, dropoff, or pickup address ([edcb068](https://github.com/bloom-housing/bloom/commit/edcb068ca23411e0a34f1dc2ff4c77ab489ac0fc))
* csv export auth check ([#2488](https://github.com/bloom-housing/bloom/issues/2488)) ([6faf8f5](https://github.com/bloom-housing/bloom/commit/6faf8f59b115adf73e70d56c855ba5b6d325d22a))
* fix for csv dempgraphics and preference patch ([0ffc090](https://github.com/bloom-housing/bloom/commit/0ffc0900fee73b34fd953e5355552e2e763c239c))
* listings management keep empty strings, remove empty objects ([3aba274](https://github.com/bloom-housing/bloom/commit/3aba274a751cdb2db55b65ade1cda5d1689ca681))
* patches translations for preferences ([#2410](https://github.com/bloom-housing/bloom/issues/2410)) ([21f517e](https://github.com/bloom-housing/bloom/commit/21f517e3f62dc5fefc8b4031d8915c8d7690677d))
* recalculate units available on listing update ([9c3967f](https://github.com/bloom-housing/bloom/commit/9c3967f0b74526db39df4f5dbc7ad9a52741a6ea))
* units with invalid ami chart ([621ff02](https://github.com/bloom-housing/bloom/commit/621ff0227270861047e885467f9ddd77459adec1))
* updates household member count ([f822713](https://github.com/bloom-housing/bloom/commit/f82271397d02025629d7ea039b40cdac95877c45))
* updates partner check for listing perm ([#2484](https://github.com/bloom-housing/bloom/issues/2484)) ([c2ab01f](https://github.com/bloom-housing/bloom/commit/c2ab01f6520b138bead01dec7352618b90635432))


* 2022-04-08 release (#2646) ([aa9de52](https://github.com/bloom-housing/bloom/commit/aa9de524d5e849ffded475070abf529de77c9a92)), closes [#2646](https://github.com/bloom-housing/bloom/issues/2646) [#2356](https://github.com/bloom-housing/bloom/issues/2356) [#2353](https://github.com/bloom-housing/bloom/issues/2353) [#2338](https://github.com/bloom-housing/bloom/issues/2338) [#2377](https://github.com/bloom-housing/bloom/issues/2377) [#2320](https://github.com/bloom-housing/bloom/issues/2320) [#2386](https://github.com/bloom-housing/bloom/issues/2386) [#2362](https://github.com/bloom-housing/bloom/issues/2362) [#2395](https://github.com/bloom-housing/bloom/issues/2395) [#2410](https://github.com/bloom-housing/bloom/issues/2410) [#2407](https://github.com/bloom-housing/bloom/issues/2407) [#2430](https://github.com/bloom-housing/bloom/issues/2430) [#2418](https://github.com/bloom-housing/bloom/issues/2418) [#2434](https://github.com/bloom-housing/bloom/issues/2434) [#2374](https://github.com/bloom-housing/bloom/issues/2374) [#2435](https://github.com/bloom-housing/bloom/issues/2435) [#2420](https://github.com/bloom-housing/bloom/issues/2420) [#2412](https://github.com/bloom-housing/bloom/issues/2412) [#2438](https://github.com/bloom-housing/bloom/issues/2438) [#2429](https://github.com/bloom-housing/bloom/issues/2429) [#2452](https://github.com/bloom-housing/bloom/issues/2452) [#2458](https://github.com/bloom-housing/bloom/issues/2458) [#2423](https://github.com/bloom-housing/bloom/issues/2423) [#2432](https://github.com/bloom-housing/bloom/issues/2432) [#2437](https://github.com/bloom-housing/bloom/issues/2437) [#2440](https://github.com/bloom-housing/bloom/issues/2440) [#2441](https://github.com/bloom-housing/bloom/issues/2441) [#2460](https://github.com/bloom-housing/bloom/issues/2460) [#2459](https://github.com/bloom-housing/bloom/issues/2459) [#2464](https://github.com/bloom-housing/bloom/issues/2464) [#2465](https://github.com/bloom-housing/bloom/issues/2465) [#2466](https://github.com/bloom-housing/bloom/issues/2466) [#2436](https://github.com/bloom-housing/bloom/issues/2436) [#2451](https://github.com/bloom-housing/bloom/issues/2451) [#2415](https://github.com/bloom-housing/bloom/issues/2415) [#2354](https://github.com/bloom-housing/bloom/issues/2354) [#2455](https://github.com/bloom-housing/bloom/issues/2455) [#2484](https://github.com/bloom-housing/bloom/issues/2484) [#2482](https://github.com/bloom-housing/bloom/issues/2482) [#2483](https://github.com/bloom-housing/bloom/issues/2483) [#2476](https://github.com/bloom-housing/bloom/issues/2476) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2470](https://github.com/bloom-housing/bloom/issues/2470) [#2488](https://github.com/bloom-housing/bloom/issues/2488) [#2487](https://github.com/bloom-housing/bloom/issues/2487) [#2496](https://github.com/bloom-housing/bloom/issues/2496) [#2498](https://github.com/bloom-housing/bloom/issues/2498) [#2499](https://github.com/bloom-housing/bloom/issues/2499) [#2291](https://github.com/bloom-housing/bloom/issues/2291) [#2461](https://github.com/bloom-housing/bloom/issues/2461) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2494](https://github.com/bloom-housing/bloom/issues/2494) [#2503](https://github.com/bloom-housing/bloom/issues/2503) [#2495](https://github.com/bloom-housing/bloom/issues/2495) [#2477](https://github.com/bloom-housing/bloom/issues/2477) [#2505](https://github.com/bloom-housing/bloom/issues/2505) [#2372](https://github.com/bloom-housing/bloom/issues/2372) [#2489](https://github.com/bloom-housing/bloom/issues/2489) [#2497](https://github.com/bloom-housing/bloom/issues/2497) [#2506](https://github.com/bloom-housing/bloom/issues/2506) [#2486](https://github.com/bloom-housing/bloom/issues/2486)
* 2022-04-05 release (#2627) ([485fb48](https://github.com/bloom-housing/bloom/commit/485fb48cfbad48bcabfef5e2e704025f608aee89)), closes [#2627](https://github.com/bloom-housing/bloom/issues/2627) [#2352](https://github.com/bloom-housing/bloom/issues/2352) [#2316](https://github.com/bloom-housing/bloom/issues/2316) [#2356](https://github.com/bloom-housing/bloom/issues/2356) [#2353](https://github.com/bloom-housing/bloom/issues/2353) [#2338](https://github.com/bloom-housing/bloom/issues/2338) [#2377](https://github.com/bloom-housing/bloom/issues/2377) [#2320](https://github.com/bloom-housing/bloom/issues/2320) [#2386](https://github.com/bloom-housing/bloom/issues/2386) [#2362](https://github.com/bloom-housing/bloom/issues/2362) [#2395](https://github.com/bloom-housing/bloom/issues/2395) [#2410](https://github.com/bloom-housing/bloom/issues/2410) [#2407](https://github.com/bloom-housing/bloom/issues/2407) [#2430](https://github.com/bloom-housing/bloom/issues/2430) [#2418](https://github.com/bloom-housing/bloom/issues/2418) [#2434](https://github.com/bloom-housing/bloom/issues/2434) [#2374](https://github.com/bloom-housing/bloom/issues/2374) [#2435](https://github.com/bloom-housing/bloom/issues/2435) [#2420](https://github.com/bloom-housing/bloom/issues/2420) [#2412](https://github.com/bloom-housing/bloom/issues/2412) [#2438](https://github.com/bloom-housing/bloom/issues/2438) [#2429](https://github.com/bloom-housing/bloom/issues/2429) [#2452](https://github.com/bloom-housing/bloom/issues/2452) [#2458](https://github.com/bloom-housing/bloom/issues/2458) [#2423](https://github.com/bloom-housing/bloom/issues/2423) [#2432](https://github.com/bloom-housing/bloom/issues/2432) [#2437](https://github.com/bloom-housing/bloom/issues/2437) [#2440](https://github.com/bloom-housing/bloom/issues/2440) [#2441](https://github.com/bloom-housing/bloom/issues/2441) [#2460](https://github.com/bloom-housing/bloom/issues/2460) [#2459](https://github.com/bloom-housing/bloom/issues/2459) [#2464](https://github.com/bloom-housing/bloom/issues/2464) [#2465](https://github.com/bloom-housing/bloom/issues/2465) [#2466](https://github.com/bloom-housing/bloom/issues/2466) [#2436](https://github.com/bloom-housing/bloom/issues/2436) [#2451](https://github.com/bloom-housing/bloom/issues/2451) [#2415](https://github.com/bloom-housing/bloom/issues/2415) [#2354](https://github.com/bloom-housing/bloom/issues/2354) [#2455](https://github.com/bloom-housing/bloom/issues/2455) [#2484](https://github.com/bloom-housing/bloom/issues/2484) [#2482](https://github.com/bloom-housing/bloom/issues/2482) [#2483](https://github.com/bloom-housing/bloom/issues/2483) [#2476](https://github.com/bloom-housing/bloom/issues/2476) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2470](https://github.com/bloom-housing/bloom/issues/2470) [#2488](https://github.com/bloom-housing/bloom/issues/2488) [#2487](https://github.com/bloom-housing/bloom/issues/2487) [#2496](https://github.com/bloom-housing/bloom/issues/2496) [#2498](https://github.com/bloom-housing/bloom/issues/2498) [#2499](https://github.com/bloom-housing/bloom/issues/2499) [#2291](https://github.com/bloom-housing/bloom/issues/2291) [#2461](https://github.com/bloom-housing/bloom/issues/2461) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2494](https://github.com/bloom-housing/bloom/issues/2494) [#2503](https://github.com/bloom-housing/bloom/issues/2503) [#2495](https://github.com/bloom-housing/bloom/issues/2495) [#2477](https://github.com/bloom-housing/bloom/issues/2477) [#2505](https://github.com/bloom-housing/bloom/issues/2505) [#2372](https://github.com/bloom-housing/bloom/issues/2372) [#2489](https://github.com/bloom-housing/bloom/issues/2489) [#2497](https://github.com/bloom-housing/bloom/issues/2497) [#2506](https://github.com/bloom-housing/bloom/issues/2506) [#2486](https://github.com/bloom-housing/bloom/issues/2486)
* 2022-04-04 release (#2614) ([fecab85](https://github.com/bloom-housing/bloom/commit/fecab85c748a55ab4aff5d591c8e0ac702254559)), closes [#2614](https://github.com/bloom-housing/bloom/issues/2614) [#2349](https://github.com/bloom-housing/bloom/issues/2349) [#2350](https://github.com/bloom-housing/bloom/issues/2350) [#2351](https://github.com/bloom-housing/bloom/issues/2351) [#2348](https://github.com/bloom-housing/bloom/issues/2348) [#2352](https://github.com/bloom-housing/bloom/issues/2352) [#2316](https://github.com/bloom-housing/bloom/issues/2316) [#2356](https://github.com/bloom-housing/bloom/issues/2356) [#2353](https://github.com/bloom-housing/bloom/issues/2353) [#2338](https://github.com/bloom-housing/bloom/issues/2338) [#2377](https://github.com/bloom-housing/bloom/issues/2377) [#2320](https://github.com/bloom-housing/bloom/issues/2320) [#2386](https://github.com/bloom-housing/bloom/issues/2386) [#2362](https://github.com/bloom-housing/bloom/issues/2362) [#2395](https://github.com/bloom-housing/bloom/issues/2395) [#2410](https://github.com/bloom-housing/bloom/issues/2410) [#2407](https://github.com/bloom-housing/bloom/issues/2407) [#2430](https://github.com/bloom-housing/bloom/issues/2430) [#2418](https://github.com/bloom-housing/bloom/issues/2418) [#2434](https://github.com/bloom-housing/bloom/issues/2434) [#2374](https://github.com/bloom-housing/bloom/issues/2374) [#2435](https://github.com/bloom-housing/bloom/issues/2435) [#2420](https://github.com/bloom-housing/bloom/issues/2420) [#2412](https://github.com/bloom-housing/bloom/issues/2412) [#2438](https://github.com/bloom-housing/bloom/issues/2438) [#2429](https://github.com/bloom-housing/bloom/issues/2429) [#2452](https://github.com/bloom-housing/bloom/issues/2452) [#2458](https://github.com/bloom-housing/bloom/issues/2458) [#2423](https://github.com/bloom-housing/bloom/issues/2423) [#2432](https://github.com/bloom-housing/bloom/issues/2432) [#2437](https://github.com/bloom-housing/bloom/issues/2437) [#2440](https://github.com/bloom-housing/bloom/issues/2440) [#2441](https://github.com/bloom-housing/bloom/issues/2441) [#2460](https://github.com/bloom-housing/bloom/issues/2460) [#2459](https://github.com/bloom-housing/bloom/issues/2459) [#2464](https://github.com/bloom-housing/bloom/issues/2464) [#2465](https://github.com/bloom-housing/bloom/issues/2465) [#2466](https://github.com/bloom-housing/bloom/issues/2466) [#2436](https://github.com/bloom-housing/bloom/issues/2436) [#2451](https://github.com/bloom-housing/bloom/issues/2451) [#2415](https://github.com/bloom-housing/bloom/issues/2415) [#2354](https://github.com/bloom-housing/bloom/issues/2354) [#2455](https://github.com/bloom-housing/bloom/issues/2455) [#2484](https://github.com/bloom-housing/bloom/issues/2484) [#2482](https://github.com/bloom-housing/bloom/issues/2482) [#2483](https://github.com/bloom-housing/bloom/issues/2483) [#2476](https://github.com/bloom-housing/bloom/issues/2476) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2470](https://github.com/bloom-housing/bloom/issues/2470) [#2488](https://github.com/bloom-housing/bloom/issues/2488) [#2487](https://github.com/bloom-housing/bloom/issues/2487) [#2496](https://github.com/bloom-housing/bloom/issues/2496) [#2498](https://github.com/bloom-housing/bloom/issues/2498) [#2499](https://github.com/bloom-housing/bloom/issues/2499) [#2291](https://github.com/bloom-housing/bloom/issues/2291) [#2461](https://github.com/bloom-housing/bloom/issues/2461) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2494](https://github.com/bloom-housing/bloom/issues/2494) [#2503](https://github.com/bloom-housing/bloom/issues/2503) [#2495](https://github.com/bloom-housing/bloom/issues/2495) [#2477](https://github.com/bloom-housing/bloom/issues/2477) [#2505](https://github.com/bloom-housing/bloom/issues/2505) [#2372](https://github.com/bloom-housing/bloom/issues/2372) [#2489](https://github.com/bloom-housing/bloom/issues/2489) [#2497](https://github.com/bloom-housing/bloom/issues/2497) [#2506](https://github.com/bloom-housing/bloom/issues/2506) [#2486](https://github.com/bloom-housing/bloom/issues/2486)
* 2022-03-01 release (#2550) ([2f2264c](https://github.com/bloom-housing/bloom/commit/2f2264cffe41d0cc1ebb79ef5c894458694d9340)), closes [#2550](https://github.com/bloom-housing/bloom/issues/2550) [#2288](https://github.com/bloom-housing/bloom/issues/2288) [#2317](https://github.com/bloom-housing/bloom/issues/2317) [#2319](https://github.com/bloom-housing/bloom/issues/2319) [#2108](https://github.com/bloom-housing/bloom/issues/2108) [#2326](https://github.com/bloom-housing/bloom/issues/2326) [#2349](https://github.com/bloom-housing/bloom/issues/2349) [#2350](https://github.com/bloom-housing/bloom/issues/2350) [#2351](https://github.com/bloom-housing/bloom/issues/2351) [#2348](https://github.com/bloom-housing/bloom/issues/2348) [#2352](https://github.com/bloom-housing/bloom/issues/2352) [#2316](https://github.com/bloom-housing/bloom/issues/2316) [#2356](https://github.com/bloom-housing/bloom/issues/2356) [#2353](https://github.com/bloom-housing/bloom/issues/2353) [#2338](https://github.com/bloom-housing/bloom/issues/2338) [#2377](https://github.com/bloom-housing/bloom/issues/2377) [#2320](https://github.com/bloom-housing/bloom/issues/2320) [#2386](https://github.com/bloom-housing/bloom/issues/2386) [#2362](https://github.com/bloom-housing/bloom/issues/2362) [#2395](https://github.com/bloom-housing/bloom/issues/2395) [#2410](https://github.com/bloom-housing/bloom/issues/2410) [#2407](https://github.com/bloom-housing/bloom/issues/2407) [#2430](https://github.com/bloom-housing/bloom/issues/2430) [#2418](https://github.com/bloom-housing/bloom/issues/2418) [#2434](https://github.com/bloom-housing/bloom/issues/2434) [#2374](https://github.com/bloom-housing/bloom/issues/2374) [#2435](https://github.com/bloom-housing/bloom/issues/2435) [#2420](https://github.com/bloom-housing/bloom/issues/2420) [#2412](https://github.com/bloom-housing/bloom/issues/2412) [#2438](https://github.com/bloom-housing/bloom/issues/2438) [#2429](https://github.com/bloom-housing/bloom/issues/2429) [#2452](https://github.com/bloom-housing/bloom/issues/2452) [#2458](https://github.com/bloom-housing/bloom/issues/2458) [#2423](https://github.com/bloom-housing/bloom/issues/2423) [#2432](https://github.com/bloom-housing/bloom/issues/2432) [#2437](https://github.com/bloom-housing/bloom/issues/2437) [#2440](https://github.com/bloom-housing/bloom/issues/2440) [#2441](https://github.com/bloom-housing/bloom/issues/2441) [#2460](https://github.com/bloom-housing/bloom/issues/2460) [#2459](https://github.com/bloom-housing/bloom/issues/2459) [#2464](https://github.com/bloom-housing/bloom/issues/2464) [#2465](https://github.com/bloom-housing/bloom/issues/2465) [#2466](https://github.com/bloom-housing/bloom/issues/2466) [#2436](https://github.com/bloom-housing/bloom/issues/2436) [#2451](https://github.com/bloom-housing/bloom/issues/2451) [#2415](https://github.com/bloom-housing/bloom/issues/2415) [#2354](https://github.com/bloom-housing/bloom/issues/2354) [#2455](https://github.com/bloom-housing/bloom/issues/2455) [#2484](https://github.com/bloom-housing/bloom/issues/2484) [#2482](https://github.com/bloom-housing/bloom/issues/2482) [#2483](https://github.com/bloom-housing/bloom/issues/2483) [#2476](https://github.com/bloom-housing/bloom/issues/2476) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2470](https://github.com/bloom-housing/bloom/issues/2470) [#2488](https://github.com/bloom-housing/bloom/issues/2488) [#2487](https://github.com/bloom-housing/bloom/issues/2487) [#2496](https://github.com/bloom-housing/bloom/issues/2496) [#2498](https://github.com/bloom-housing/bloom/issues/2498) [#2499](https://github.com/bloom-housing/bloom/issues/2499) [#2291](https://github.com/bloom-housing/bloom/issues/2291) [#2461](https://github.com/bloom-housing/bloom/issues/2461) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2494](https://github.com/bloom-housing/bloom/issues/2494) [#2503](https://github.com/bloom-housing/bloom/issues/2503) [#2495](https://github.com/bloom-housing/bloom/issues/2495) [#2477](https://github.com/bloom-housing/bloom/issues/2477) [#2505](https://github.com/bloom-housing/bloom/issues/2505) [#2372](https://github.com/bloom-housing/bloom/issues/2372) [#2489](https://github.com/bloom-housing/bloom/issues/2489) [#2497](https://github.com/bloom-housing/bloom/issues/2497) [#2506](https://github.com/bloom-housing/bloom/issues/2506) [#2486](https://github.com/bloom-housing/bloom/issues/2486)
* 2022-01-27 release (#2439) ([860f6af](https://github.com/bloom-housing/bloom/commit/860f6af6204903e4dcddf671d7ba54f3ec04f121)), closes [#2439](https://github.com/bloom-housing/bloom/issues/2439) [#2196](https://github.com/bloom-housing/bloom/issues/2196) [#2238](https://github.com/bloom-housing/bloom/issues/2238) [#2226](https://github.com/bloom-housing/bloom/issues/2226) [#2230](https://github.com/bloom-housing/bloom/issues/2230) [#2243](https://github.com/bloom-housing/bloom/issues/2243) [#2195](https://github.com/bloom-housing/bloom/issues/2195) [#2215](https://github.com/bloom-housing/bloom/issues/2215) [#2266](https://github.com/bloom-housing/bloom/issues/2266) [#2188](https://github.com/bloom-housing/bloom/issues/2188) [#2270](https://github.com/bloom-housing/bloom/issues/2270) [#2188](https://github.com/bloom-housing/bloom/issues/2188) [#2213](https://github.com/bloom-housing/bloom/issues/2213) [#2234](https://github.com/bloom-housing/bloom/issues/2234) [#1901](https://github.com/bloom-housing/bloom/issues/1901) [#2260](https://github.com/bloom-housing/bloom/issues/2260) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#2280](https://github.com/bloom-housing/bloom/issues/2280) [#2253](https://github.com/bloom-housing/bloom/issues/2253) [#2276](https://github.com/bloom-housing/bloom/issues/2276) [#2282](https://github.com/bloom-housing/bloom/issues/2282) [#2262](https://github.com/bloom-housing/bloom/issues/2262) [#2278](https://github.com/bloom-housing/bloom/issues/2278) [#2293](https://github.com/bloom-housing/bloom/issues/2293) [#2295](https://github.com/bloom-housing/bloom/issues/2295) [#2296](https://github.com/bloom-housing/bloom/issues/2296) [#2294](https://github.com/bloom-housing/bloom/issues/2294) [#2277](https://github.com/bloom-housing/bloom/issues/2277) [#2290](https://github.com/bloom-housing/bloom/issues/2290) [#2299](https://github.com/bloom-housing/bloom/issues/2299) [#2292](https://github.com/bloom-housing/bloom/issues/2292) [#2303](https://github.com/bloom-housing/bloom/issues/2303) [#2305](https://github.com/bloom-housing/bloom/issues/2305) [#2306](https://github.com/bloom-housing/bloom/issues/2306) [#2308](https://github.com/bloom-housing/bloom/issues/2308) [#2190](https://github.com/bloom-housing/bloom/issues/2190) [#2239](https://github.com/bloom-housing/bloom/issues/2239) [#2311](https://github.com/bloom-housing/bloom/issues/2311) [#2302](https://github.com/bloom-housing/bloom/issues/2302) [#2301](https://github.com/bloom-housing/bloom/issues/2301) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#2313](https://github.com/bloom-housing/bloom/issues/2313) [#2289](https://github.com/bloom-housing/bloom/issues/2289) [#2279](https://github.com/bloom-housing/bloom/issues/2279) [#2288](https://github.com/bloom-housing/bloom/issues/2288) [#2317](https://github.com/bloom-housing/bloom/issues/2317) [#2319](https://github.com/bloom-housing/bloom/issues/2319) [#2108](https://github.com/bloom-housing/bloom/issues/2108) [#2326](https://github.com/bloom-housing/bloom/issues/2326) [#2349](https://github.com/bloom-housing/bloom/issues/2349) [#2350](https://github.com/bloom-housing/bloom/issues/2350) [#2351](https://github.com/bloom-housing/bloom/issues/2351) [#2348](https://github.com/bloom-housing/bloom/issues/2348) [#2352](https://github.com/bloom-housing/bloom/issues/2352) [#2316](https://github.com/bloom-housing/bloom/issues/2316) [#2356](https://github.com/bloom-housing/bloom/issues/2356) [#2353](https://github.com/bloom-housing/bloom/issues/2353) [#2338](https://github.com/bloom-housing/bloom/issues/2338) [#2377](https://github.com/bloom-housing/bloom/issues/2377) [#2320](https://github.com/bloom-housing/bloom/issues/2320) [#2386](https://github.com/bloom-housing/bloom/issues/2386) [#2362](https://github.com/bloom-housing/bloom/issues/2362) [#2395](https://github.com/bloom-housing/bloom/issues/2395) [#2410](https://github.com/bloom-housing/bloom/issues/2410) [#2407](https://github.com/bloom-housing/bloom/issues/2407) [#2430](https://github.com/bloom-housing/bloom/issues/2430) [#2418](https://github.com/bloom-housing/bloom/issues/2418) [#2434](https://github.com/bloom-housing/bloom/issues/2434) [#2374](https://github.com/bloom-housing/bloom/issues/2374) [#2435](https://github.com/bloom-housing/bloom/issues/2435) [#2420](https://github.com/bloom-housing/bloom/issues/2420) [#2412](https://github.com/bloom-housing/bloom/issues/2412) [#2434](https://github.com/bloom-housing/bloom/issues/2434)
* Release 11 11 21 (#2162) ([4847469](https://github.com/bloom-housing/bloom/commit/484746982e440c1c1c87c85089d86cd5968f1cae)), closes [#2162](https://github.com/bloom-housing/bloom/issues/2162)


### Features

* add a phone number column to the user_accounts table ([44881da](https://github.com/bloom-housing/bloom/commit/44881da1a7ccc17b7d4db1fcf79513632c18066d))
* Add San Jose email translations ([#2519](https://github.com/bloom-housing/bloom/issues/2519)) ([d1db032](https://github.com/bloom-housing/bloom/commit/d1db032672f40d325eba9e4a833d24f8b02464cc))
* add SRO unit type ([a4c1403](https://github.com/bloom-housing/bloom/commit/a4c140350a84a5bacfa65fb6714aa594e406945d))
* adding alameda prog and prefs ([#2696](https://github.com/bloom-housing/bloom/issues/2696)) ([85c0bf5](https://github.com/bloom-housing/bloom/commit/85c0bf5b41c86c4dddb0bfb99d65a652f8cad1a0))
* adds jurisdictions to pref seeds ([8a70b68](https://github.com/bloom-housing/bloom/commit/8a70b688ec8c6eb785543d5ce91ae182f62af168))
* adds new preferences, reserved community type ([90c0673](https://github.com/bloom-housing/bloom/commit/90c0673779eeb028041717d0b1e0e69fb0766c71))
* adds whatToExpect to GTrans ([461961a](https://github.com/bloom-housing/bloom/commit/461961a4dd48d7a1c935e4dc03e9a62d2f455088))
* adds whatToExpect to GTrans ([#2303](https://github.com/bloom-housing/bloom/issues/2303)) ([38e672a](https://github.com/bloom-housing/bloom/commit/38e672a4dbd6c39a7a01b04698f2096a62eed8a1))
* ami chart jurisdictionalized ([b2e2537](https://github.com/bloom-housing/bloom/commit/b2e2537818d92ff41ea51fbbeb23d9d7e8c1cf52))
* **backend:** add storing listing translations ([#2215](https://github.com/bloom-housing/bloom/issues/2215)) ([d6a1337](https://github.com/bloom-housing/bloom/commit/d6a1337fbe3da8a159e2b60638fc527aa65aaef0))
* **backend:** all programs to csv export ([#2302](https://github.com/bloom-housing/bloom/issues/2302)) ([48b50f9](https://github.com/bloom-housing/bloom/commit/48b50f95be794773cc68ebee3144c1f44db26f04))
* **backend:** fix translations table relation to jurisdiction ([#2506](https://github.com/bloom-housing/bloom/issues/2506)) ([22b9f23](https://github.com/bloom-housing/bloom/commit/22b9f23eb405f701796193515dff35058cc4f7dc))
* better seed data for ami-charts ([24eb7e4](https://github.com/bloom-housing/bloom/commit/24eb7e41512963f8dc716b74e8a8684e1272e1b7))
* feat(backend): make use of new application confirmation codes ([8f386e8](https://github.com/bloom-housing/bloom/commit/8f386e8e656c8d498d41de947f2e5246d3c16b19))
* new demographics sub-race questions ([910df6a](https://github.com/bloom-housing/bloom/commit/910df6ad3985980becdc2798076ed5dfeeb310b5))
* one month rent ([319743d](https://github.com/bloom-housing/bloom/commit/319743d23268f5b55e129c0878510edb4204b668))
* overrides fallback to english, tagalog support ([b79fd10](https://github.com/bloom-housing/bloom/commit/b79fd1018619f618bd9be8e870d35c1180b81dfb))
* temp disable terms and set mfa enabled to false ([#2595](https://github.com/bloom-housing/bloom/issues/2595)) ([6de2dcd](https://github.com/bloom-housing/bloom/commit/6de2dcd8baeb28166d7a6c383846a7ab9a84b0e2))
* updates email confirmation for lottery ([768064a](https://github.com/bloom-housing/bloom/commit/768064a985ed858fae681caebcbcdb561319eaf9))


### Reverts

* Revert "chore: removes application program partners" ([91e22d8](https://github.com/bloom-housing/bloom/commit/91e22d891104e8d4fc024d709a6a14cec1400733))
* Revert "chore: removes application program display" ([740cf00](https://github.com/bloom-housing/bloom/commit/740cf00dc3a729eed037d56a8dfc5988decd2651))


### BREAKING CHANGES

* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* sign-in pages have been updated
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* preferences model and relationships changed

* feat: feat(backend): extend UserUpdateDto to support email change

picked from dev 3e1fdbd0ea91d4773973d5c485a5ba61303db90a

* fix: 2056/user account edit fix

picked from dev a15618c0cb548ff5b2ae913b802c9e08bb673f30

* refactor: 2085/adds top level catchAll exception filter

picked from dev aeaa63d1af1fa3d11671e169cb3bd23d356fface

* feat: feat: Change unit number field type to text

picked from dev f54be7c7ba6aac8e00fee610dc86584b60cc212d

* feat(backend): improve application flagged set saving efficiency

* fix: fix: updates address order

picked from dev 252e014dcbd2e4c305384ed552135f5a8e4e4767

* fix: sets programs to optoinal and updates versions

* chore: chore(deps): bump electron from 13.1.7 to 13.3.0

* chore: chore(deps): bump axios from 0.21.1 to 0.21.2

* fix: adds programs service

* fix: fix lisitng e2e tests

* fix: fix member tests





## [4.2.3](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@4.2.2...@bloom-housing/backend-core@4.2.3) (2022-04-28)

**Note:** Version bump only for package @bloom-housing/backend-core

### Features
* adding alameda prog and prefs ([#2696](https://github.com/seanmalbert/bloom/issues/2696)) ([85c0bf5](https://github.com/seanmalbert/bloom/commit/85c0bf5b41c86c4dddb0bfb99d65a652f8cad1a0))

## [4.2.2-alpha.9](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.2-alpha.8...@bloom-housing/backend-core@4.2.2-alpha.9) (2022-05-11)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.2.2-alpha.8](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.2-alpha.7...@bloom-housing/backend-core@4.2.2-alpha.8) (2022-05-11)


### Features

* **backend:** add search param to GET /user/list endpoint ([#2714](https://github.com/bloom-housing/bloom/issues/2714)) ([95c9a68](https://github.com/bloom-housing/bloom/commit/95c9a6838f534450c0da6919064f4a799898ed8f))





## [4.2.2-alpha.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.2-alpha.6...@bloom-housing/backend-core@4.2.2-alpha.7) (2022-05-03)


### Features

* **backend:** improve ami chart dto definitions ([#2677](https://github.com/bloom-housing/bloom/issues/2677)) ([ca3890e](https://github.com/bloom-housing/bloom/commit/ca3890e2759f230824e31e6bd985300f40b0a0ed))





## [4.2.2-alpha.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.2-alpha.5...@bloom-housing/backend-core@4.2.2-alpha.6) (2022-04-29)


### Bug Fixes

* check for empty translations before sending to google translate service ([#2700](https://github.com/bloom-housing/bloom/issues/2700)) ([d116fdb](https://github.com/bloom-housing/bloom/commit/d116fdbdab3c874679abc8e3dba8e23179fc78e2))





## [4.2.2-alpha.5](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.2-alpha.4...@bloom-housing/backend-core@4.2.2-alpha.5) (2022-04-28)


### Bug Fixes

* authservice.token data null issue ([#2703](https://github.com/bloom-housing/bloom/issues/2703)) ([3b1b931](https://github.com/bloom-housing/bloom/commit/3b1b9316a6dd42adc22249b8e8dd836de2258406))





## [4.2.2-alpha.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.2-alpha.3...@bloom-housing/backend-core@4.2.2-alpha.4) (2022-04-27)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.2.2-alpha.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.2-alpha.2...@bloom-housing/backend-core@4.2.2-alpha.3) (2022-04-21)


### Features

* **backend:** improve user queries ([#2676](https://github.com/bloom-housing/bloom/issues/2676)) ([4733e8a](https://github.com/bloom-housing/bloom/commit/4733e8a9909e47bb2522f9b319f45fe25923cdb5))





## [4.2.2-alpha.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.2-alpha.1...@bloom-housing/backend-core@4.2.2-alpha.2) (2022-04-20)


### Features

* **backend:** add jurisdiction default rental assistance text ([#2604](https://github.com/bloom-housing/bloom/issues/2604)) ([00b684c](https://github.com/bloom-housing/bloom/commit/00b684cd8b8b1f9ef201b8aec78c13572a4125a5))





## [4.2.2-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.2-alpha.0...@bloom-housing/backend-core@4.2.2-alpha.1) (2022-04-14)


### Features

* **backend:** add order param to listings GET endpoint ([#2630](https://github.com/bloom-housing/bloom/issues/2630)) ([2a915f2](https://github.com/bloom-housing/bloom/commit/2a915f2bb0d07fb20e2c829896fa22a13e4da1bf))





## [4.2.2-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.1-alpha.2...@bloom-housing/backend-core@4.2.2-alpha.0) (2022-04-13)


* 2022-04-11 sync master (#2649) ([9d30acf](https://github.com/bloom-housing/bloom/commit/9d30acf7b53fca50a87fc8bd2658c11d3ed37427)), closes [#2649](https://github.com/bloom-housing/bloom/issues/2649) [#2037](https://github.com/bloom-housing/bloom/issues/2037) [#2095](https://github.com/bloom-housing/bloom/issues/2095) [#2162](https://github.com/bloom-housing/bloom/issues/2162) [#2293](https://github.com/bloom-housing/bloom/issues/2293) [#2295](https://github.com/bloom-housing/bloom/issues/2295) [#2296](https://github.com/bloom-housing/bloom/issues/2296) [#2294](https://github.com/bloom-housing/bloom/issues/2294) [#2277](https://github.com/bloom-housing/bloom/issues/2277) [#2299](https://github.com/bloom-housing/bloom/issues/2299) [#2292](https://github.com/bloom-housing/bloom/issues/2292) [#2308](https://github.com/bloom-housing/bloom/issues/2308) [#2239](https://github.com/bloom-housing/bloom/issues/2239) [#2311](https://github.com/bloom-housing/bloom/issues/2311) [#2230](https://github.com/bloom-housing/bloom/issues/2230) [#2302](https://github.com/bloom-housing/bloom/issues/2302) [#2288](https://github.com/bloom-housing/bloom/issues/2288) [#2317](https://github.com/bloom-housing/bloom/issues/2317) [#2386](https://github.com/bloom-housing/bloom/issues/2386) [#2215](https://github.com/bloom-housing/bloom/issues/2215) [#2303](https://github.com/bloom-housing/bloom/issues/2303) [#2410](https://github.com/bloom-housing/bloom/issues/2410) [#2430](https://github.com/bloom-housing/bloom/issues/2430) [#2439](https://github.com/bloom-housing/bloom/issues/2439) [#2196](https://github.com/bloom-housing/bloom/issues/2196) [#2238](https://github.com/bloom-housing/bloom/issues/2238) [#2226](https://github.com/bloom-housing/bloom/issues/2226) [#2230](https://github.com/bloom-housing/bloom/issues/2230) [#2243](https://github.com/bloom-housing/bloom/issues/2243) [#2195](https://github.com/bloom-housing/bloom/issues/2195) [#2215](https://github.com/bloom-housing/bloom/issues/2215) [#2266](https://github.com/bloom-housing/bloom/issues/2266) [#2188](https://github.com/bloom-housing/bloom/issues/2188) [#2270](https://github.com/bloom-housing/bloom/issues/2270) [#2188](https://github.com/bloom-housing/bloom/issues/2188) [#2213](https://github.com/bloom-housing/bloom/issues/2213) [#2234](https://github.com/bloom-housing/bloom/issues/2234) [#1901](https://github.com/bloom-housing/bloom/issues/1901) [#2260](https://github.com/bloom-housing/bloom/issues/2260) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#2280](https://github.com/bloom-housing/bloom/issues/2280) [#2253](https://github.com/bloom-housing/bloom/issues/2253) [#2276](https://github.com/bloom-housing/bloom/issues/2276) [#2282](https://github.com/bloom-housing/bloom/issues/2282) [#2262](https://github.com/bloom-housing/bloom/issues/2262) [#2278](https://github.com/bloom-housing/bloom/issues/2278) [#2293](https://github.com/bloom-housing/bloom/issues/2293) [#2295](https://github.com/bloom-housing/bloom/issues/2295) [#2296](https://github.com/bloom-housing/bloom/issues/2296) [#2294](https://github.com/bloom-housing/bloom/issues/2294) [#2277](https://github.com/bloom-housing/bloom/issues/2277) [#2290](https://github.com/bloom-housing/bloom/issues/2290) [#2299](https://github.com/bloom-housing/bloom/issues/2299) [#2292](https://github.com/bloom-housing/bloom/issues/2292) [#2303](https://github.com/bloom-housing/bloom/issues/2303) [#2305](https://github.com/bloom-housing/bloom/issues/2305) [#2306](https://github.com/bloom-housing/bloom/issues/2306) [#2308](https://github.com/bloom-housing/bloom/issues/2308) [#2190](https://github.com/bloom-housing/bloom/issues/2190) [#2239](https://github.com/bloom-housing/bloom/issues/2239) [#2311](https://github.com/bloom-housing/bloom/issues/2311) [#2302](https://github.com/bloom-housing/bloom/issues/2302) [#2301](https://github.com/bloom-housing/bloom/issues/2301) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#2313](https://github.com/bloom-housing/bloom/issues/2313) [#2289](https://github.com/bloom-housing/bloom/issues/2289) [#2279](https://github.com/bloom-housing/bloom/issues/2279) [#2288](https://github.com/bloom-housing/bloom/issues/2288) [#2317](https://github.com/bloom-housing/bloom/issues/2317) [#2319](https://github.com/bloom-housing/bloom/issues/2319) [#2108](https://github.com/bloom-housing/bloom/issues/2108) [#2326](https://github.com/bloom-housing/bloom/issues/2326) [#2349](https://github.com/bloom-housing/bloom/issues/2349) [#2350](https://github.com/bloom-housing/bloom/issues/2350) [#2351](https://github.com/bloom-housing/bloom/issues/2351) [#2348](https://github.com/bloom-housing/bloom/issues/2348) [#2352](https://github.com/bloom-housing/bloom/issues/2352) [#2316](https://github.com/bloom-housing/bloom/issues/2316) [#2356](https://github.com/bloom-housing/bloom/issues/2356) [#2353](https://github.com/bloom-housing/bloom/issues/2353) [#2338](https://github.com/bloom-housing/bloom/issues/2338) [#2377](https://github.com/bloom-housing/bloom/issues/2377) [#2320](https://github.com/bloom-housing/bloom/issues/2320) [#2386](https://github.com/bloom-housing/bloom/issues/2386) [#2362](https://github.com/bloom-housing/bloom/issues/2362) [#2395](https://github.com/bloom-housing/bloom/issues/2395) [#2410](https://github.com/bloom-housing/bloom/issues/2410) [#2407](https://github.com/bloom-housing/bloom/issues/2407) [#2430](https://github.com/bloom-housing/bloom/issues/2430) [#2418](https://github.com/bloom-housing/bloom/issues/2418) [#2434](https://github.com/bloom-housing/bloom/issues/2434) [#2374](https://github.com/bloom-housing/bloom/issues/2374) [#2435](https://github.com/bloom-housing/bloom/issues/2435) [#2420](https://github.com/bloom-housing/bloom/issues/2420) [#2412](https://github.com/bloom-housing/bloom/issues/2412) [#2434](https://github.com/bloom-housing/bloom/issues/2434) [#2458](https://github.com/bloom-housing/bloom/issues/2458) [#2460](https://github.com/bloom-housing/bloom/issues/2460) [#2465](https://github.com/bloom-housing/bloom/issues/2465) [#2436](https://github.com/bloom-housing/bloom/issues/2436) [#2484](https://github.com/bloom-housing/bloom/issues/2484) [#2482](https://github.com/bloom-housing/bloom/issues/2482) [#2483](https://github.com/bloom-housing/bloom/issues/2483) [#2488](https://github.com/bloom-housing/bloom/issues/2488) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2519](https://github.com/bloom-housing/bloom/issues/2519) [#2506](https://github.com/bloom-housing/bloom/issues/2506) [#2534](https://github.com/bloom-housing/bloom/issues/2534) [#2544](https://github.com/bloom-housing/bloom/issues/2544) [#2550](https://github.com/bloom-housing/bloom/issues/2550) [#2288](https://github.com/bloom-housing/bloom/issues/2288) [#2317](https://github.com/bloom-housing/bloom/issues/2317) [#2319](https://github.com/bloom-housing/bloom/issues/2319) [#2108](https://github.com/bloom-housing/bloom/issues/2108) [#2326](https://github.com/bloom-housing/bloom/issues/2326) [#2349](https://github.com/bloom-housing/bloom/issues/2349) [#2350](https://github.com/bloom-housing/bloom/issues/2350) [#2351](https://github.com/bloom-housing/bloom/issues/2351) [#2348](https://github.com/bloom-housing/bloom/issues/2348) [#2352](https://github.com/bloom-housing/bloom/issues/2352) [#2316](https://github.com/bloom-housing/bloom/issues/2316) [#2356](https://github.com/bloom-housing/bloom/issues/2356) [#2353](https://github.com/bloom-housing/bloom/issues/2353) [#2338](https://github.com/bloom-housing/bloom/issues/2338) [#2377](https://github.com/bloom-housing/bloom/issues/2377) [#2320](https://github.com/bloom-housing/bloom/issues/2320) [#2386](https://github.com/bloom-housing/bloom/issues/2386) [#2362](https://github.com/bloom-housing/bloom/issues/2362) [#2395](https://github.com/bloom-housing/bloom/issues/2395) [#2410](https://github.com/bloom-housing/bloom/issues/2410) [#2407](https://github.com/bloom-housing/bloom/issues/2407) [#2430](https://github.com/bloom-housing/bloom/issues/2430) [#2418](https://github.com/bloom-housing/bloom/issues/2418) [#2434](https://github.com/bloom-housing/bloom/issues/2434) [#2374](https://github.com/bloom-housing/bloom/issues/2374) [#2435](https://github.com/bloom-housing/bloom/issues/2435) [#2420](https://github.com/bloom-housing/bloom/issues/2420) [#2412](https://github.com/bloom-housing/bloom/issues/2412) [#2438](https://github.com/bloom-housing/bloom/issues/2438) [#2429](https://github.com/bloom-housing/bloom/issues/2429) [#2452](https://github.com/bloom-housing/bloom/issues/2452) [#2458](https://github.com/bloom-housing/bloom/issues/2458) [#2423](https://github.com/bloom-housing/bloom/issues/2423) [#2432](https://github.com/bloom-housing/bloom/issues/2432) [#2437](https://github.com/bloom-housing/bloom/issues/2437) [#2440](https://github.com/bloom-housing/bloom/issues/2440) [#2441](https://github.com/bloom-housing/bloom/issues/2441) [#2460](https://github.com/bloom-housing/bloom/issues/2460) [#2459](https://github.com/bloom-housing/bloom/issues/2459) [#2464](https://github.com/bloom-housing/bloom/issues/2464) [#2465](https://github.com/bloom-housing/bloom/issues/2465) [#2466](https://github.com/bloom-housing/bloom/issues/2466) [#2436](https://github.com/bloom-housing/bloom/issues/2436) [#2451](https://github.com/bloom-housing/bloom/issues/2451) [#2415](https://github.com/bloom-housing/bloom/issues/2415) [#2354](https://github.com/bloom-housing/bloom/issues/2354) [#2455](https://github.com/bloom-housing/bloom/issues/2455) [#2484](https://github.com/bloom-housing/bloom/issues/2484) [#2482](https://github.com/bloom-housing/bloom/issues/2482) [#2483](https://github.com/bloom-housing/bloom/issues/2483) [#2476](https://github.com/bloom-housing/bloom/issues/2476) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2470](https://github.com/bloom-housing/bloom/issues/2470) [#2488](https://github.com/bloom-housing/bloom/issues/2488) [#2487](https://github.com/bloom-housing/bloom/issues/2487) [#2496](https://github.com/bloom-housing/bloom/issues/2496) [#2498](https://github.com/bloom-housing/bloom/issues/2498) [#2499](https://github.com/bloom-housing/bloom/issues/2499) [#2291](https://github.com/bloom-housing/bloom/issues/2291) [#2461](https://github.com/bloom-housing/bloom/issues/2461) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2494](https://github.com/bloom-housing/bloom/issues/2494) [#2503](https://github.com/bloom-housing/bloom/issues/2503) [#2495](https://github.com/bloom-housing/bloom/issues/2495) [#2477](https://github.com/bloom-housing/bloom/issues/2477) [#2505](https://github.com/bloom-housing/bloom/issues/2505) [#2372](https://github.com/bloom-housing/bloom/issues/2372) [#2489](https://github.com/bloom-housing/bloom/issues/2489) [#2497](https://github.com/bloom-housing/bloom/issues/2497) [#2506](https://github.com/bloom-housing/bloom/issues/2506) [#2486](https://github.com/bloom-housing/bloom/issues/2486)


### BREAKING CHANGES

* preferences model and relationships changed

* feat: feat(backend): extend UserUpdateDto to support email change

picked from dev 3e1fdbd0ea91d4773973d5c485a5ba61303db90a

* fix: 2056/user account edit fix

picked from dev a15618c0cb548ff5b2ae913b802c9e08bb673f30

* refactor: 2085/adds top level catchAll exception filter

picked from dev aeaa63d1af1fa3d11671e169cb3bd23d356fface

* feat: feat: Change unit number field type to text

picked from dev f54be7c7ba6aac8e00fee610dc86584b60cc212d

* feat(backend): improve application flagged set saving efficiency

* fix: fix: updates address order

picked from dev 252e014dcbd2e4c305384ed552135f5a8e4e4767

* fix: sets programs to optoinal and updates versions

* chore: chore(deps): bump electron from 13.1.7 to 13.3.0

* chore: chore(deps): bump axios from 0.21.1 to 0.21.2

* fix: adds programs service

* fix: fix lisitng e2e tests

* fix: fix member tests

* fix: adds jurisdictionId to useSWR path

* fix: recalculate units available on listing update

picked form dev f1a3dbce6478b16542ed61ab20de5dfb9b797262

* feat: feat(backend): make use of new application confirmation codes

picked from dev 3c45c2904818200eed4568931d4cc352fd2f449e

* revert: revert "chore(deps): bump axios from 0.21.1 to 0.21.2

picked from dev 2b83bc0393afc42eed542e326d5ef75502ce119c

* fix: app submission w/ no due date

picked from dev 4af1f5a8448f16d347b4a65ecb85fda4d6ed71fc

* feat: adds new preferences, reserved community type

* feat: adds bottom border to preferences

* feat: updates preference string

* fix: preference cleanup for avance

* refactor: remove applicationAddress

picked from dev bf10632a62bf2f14922948c046ea3352ed010f4f

* feat: refactor and add public site application flow cypress tests

picked from dev 9ec0e8d05f9570773110754e7fdaf49254d1eab8

* feat: better seed data for ami-charts

picked from dev d8b1d4d185731a589c563a32bd592d01537785f3

* feat: adds listing management cypress tests to partner portal

* fix: listings management keep empty strings, remove empty objects

picked from dev c4b1e833ec128f457015ac7ffa421ee6047083d9

* feat: one month rent

picked from dev 883b0d53030e1c4d54f2f75bd5e188bb1d255f64

* test: view.spec.ts test

picked from dev 324446c90138d8fac50aba445f515009b5a58bfb

* refactor: removes jsonpath

picked from dev deb39acc005607ce3076942b1f49590d08afc10c

* feat: adds jurisdictions to pref seeds

picked from dev 9e47cec3b1acfe769207ccbb33c07019cd742e33

* feat: new demographics sub-race questions

picked from dev 9ab892694c1ad2fa8890b411b3b32af68ade1fc3

* feat: updates email confirmation for lottery

picked from dev 1a5e824c96d8e23674c32ea92688b9f7255528d3

* fix: add ariaHidden to Icon component

picked from dev c7bb86aec6fd5ad386c7ca50087d0113b14503be

* fix: add ariaLabel prop to Button component

picked from dev 509ddc898ba44c05e26f8ed8c777f1ba456eeee5

* fix: change the yes/no radio text to be more descriptive

picked from dev 0c46054574535523d6f217bb0677bbe732b8945f

* fix: remove alameda reference in demographics

picked from dev 7d5991cbf6dbe0b61f2b14d265e87ce3687f743d

* chore: release version

picked from dev fe82f25dc349877d974ae62d228fea0354978fb7

* feat: ami chart jurisdictionalized

picked from dev 0a5cbc88a9d9e3c2ff716fe0f44ca6c48f5dcc50

* refactor: make backend a peer dependency in ui-components

picked from dev 952aaa14a77e0960312ff0eeee51399d1d6af9f3

* feat: add a phone number column to the user_accounts table

picked from dev 2647df9ab9888a525cc8a164d091dda6482c502a

* chore: removes application program partners

* chore: removes application program display

* Revert "chore: removes application program display"

This reverts commit 14825b4a6c9cd1a7235e32074e32af18a71b5c26.

* Revert "chore: removes application program partners"

This reverts commit d7aa38c777972a2e21d9f816441caa27f98d3f86.

* chore: yarn.lock and backend-swagger

* fix: removes Duplicate identifier fieldGroupObjectToArray

* feat: skip preferences if not on listing

* chore(release): version

* fix: cannot save custom mailing, dropoff, or pickup address

* chore(release): version

* chore: converge on one axios version, remove peer dependency

* chore(release): version

* feat: simplify Waitlist component and use more flexible schema

* chore(release): version

* fix: lottery results uploads now save

* chore(release): version

* feat: add SRO unit type

* chore(release): version

* fix: paper application submission

* chore(release): version

* fix: choose-language context

* chore(release): version

* fix: applications/view hide prefs

* chore(release): version

* feat: overrides fallback to english, tagalog support

* chore(release): version

* fix: account translations

* chore(release): version

* fix: units with invalid ami chart

* chore(release): version

* fix: remove description for the partners programs

* fix: fix modal styles on mobile

* fix: visual improvement to programs form display

* fix: submission tests not running
* sign-in pages have been updated
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62





## [4.2.1](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@4.2.0...@bloom-housing/backend-core@4.2.1) (2022-04-11)


* 2022-04-08 release (#2646) ([aa9de52](https://github.com/seanmalbert/bloom/commit/aa9de524d5e849ffded475070abf529de77c9a92)), closes [#2646](https://github.com/seanmalbert/bloom/issues/2646) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2438](https://github.com/seanmalbert/bloom/issues/2438) [#2429](https://github.com/seanmalbert/bloom/issues/2429) [#2452](https://github.com/seanmalbert/bloom/issues/2452) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2423](https://github.com/seanmalbert/bloom/issues/2423) [#2432](https://github.com/seanmalbert/bloom/issues/2432) [#2437](https://github.com/seanmalbert/bloom/issues/2437) [#2440](https://github.com/seanmalbert/bloom/issues/2440) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2505](https://github.com/seanmalbert/bloom/issues/2505) [#2372](https://github.com/seanmalbert/bloom/issues/2372) [#2489](https://github.com/seanmalbert/bloom/issues/2489) [#2497](https://github.com/seanmalbert/bloom/issues/2497) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2486](https://github.com/seanmalbert/bloom/issues/2486)


### BREAKING CHANGES

* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
## [4.2.1-alpha.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.1-alpha.1...@bloom-housing/backend-core@4.2.1-alpha.2) (2022-04-13)


### Bug Fixes

* adds region to user phone # validation ([#2652](https://github.com/bloom-housing/bloom/issues/2652)) ([f4ab660](https://github.com/bloom-housing/bloom/commit/f4ab660912a4c675073558d407880c8a98687530))





## [4.2.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.2.1-alpha.0...@bloom-housing/backend-core@4.2.1-alpha.1) (2022-04-07)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.2.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.1.3-alpha.1...@bloom-housing/backend-core@4.2.1-alpha.0) (2022-04-06)


* 2022-04-06 sync master (#2628) ([bc31833](https://github.com/bloom-housing/bloom/commit/bc31833f7ea5720a242d93a01bb1b539181fbad4)), closes [#2628](https://github.com/bloom-housing/bloom/issues/2628) [#2037](https://github.com/bloom-housing/bloom/issues/2037) [#2095](https://github.com/bloom-housing/bloom/issues/2095) [#2162](https://github.com/bloom-housing/bloom/issues/2162) [#2293](https://github.com/bloom-housing/bloom/issues/2293) [#2295](https://github.com/bloom-housing/bloom/issues/2295) [#2296](https://github.com/bloom-housing/bloom/issues/2296) [#2294](https://github.com/bloom-housing/bloom/issues/2294) [#2277](https://github.com/bloom-housing/bloom/issues/2277) [#2299](https://github.com/bloom-housing/bloom/issues/2299) [#2292](https://github.com/bloom-housing/bloom/issues/2292) [#2308](https://github.com/bloom-housing/bloom/issues/2308) [#2239](https://github.com/bloom-housing/bloom/issues/2239) [#2311](https://github.com/bloom-housing/bloom/issues/2311) [#2230](https://github.com/bloom-housing/bloom/issues/2230) [#2302](https://github.com/bloom-housing/bloom/issues/2302) [#2288](https://github.com/bloom-housing/bloom/issues/2288) [#2317](https://github.com/bloom-housing/bloom/issues/2317) [#2386](https://github.com/bloom-housing/bloom/issues/2386) [#2215](https://github.com/bloom-housing/bloom/issues/2215) [#2303](https://github.com/bloom-housing/bloom/issues/2303) [#2410](https://github.com/bloom-housing/bloom/issues/2410) [#2430](https://github.com/bloom-housing/bloom/issues/2430) [#2439](https://github.com/bloom-housing/bloom/issues/2439) [#2196](https://github.com/bloom-housing/bloom/issues/2196) [#2238](https://github.com/bloom-housing/bloom/issues/2238) [#2226](https://github.com/bloom-housing/bloom/issues/2226) [#2230](https://github.com/bloom-housing/bloom/issues/2230) [#2243](https://github.com/bloom-housing/bloom/issues/2243) [#2195](https://github.com/bloom-housing/bloom/issues/2195) [#2215](https://github.com/bloom-housing/bloom/issues/2215) [#2266](https://github.com/bloom-housing/bloom/issues/2266) [#2188](https://github.com/bloom-housing/bloom/issues/2188) [#2270](https://github.com/bloom-housing/bloom/issues/2270) [#2188](https://github.com/bloom-housing/bloom/issues/2188) [#2213](https://github.com/bloom-housing/bloom/issues/2213) [#2234](https://github.com/bloom-housing/bloom/issues/2234) [#1901](https://github.com/bloom-housing/bloom/issues/1901) [#2260](https://github.com/bloom-housing/bloom/issues/2260) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#2280](https://github.com/bloom-housing/bloom/issues/2280) [#2253](https://github.com/bloom-housing/bloom/issues/2253) [#2276](https://github.com/bloom-housing/bloom/issues/2276) [#2282](https://github.com/bloom-housing/bloom/issues/2282) [#2262](https://github.com/bloom-housing/bloom/issues/2262) [#2278](https://github.com/bloom-housing/bloom/issues/2278) [#2293](https://github.com/bloom-housing/bloom/issues/2293) [#2295](https://github.com/bloom-housing/bloom/issues/2295) [#2296](https://github.com/bloom-housing/bloom/issues/2296) [#2294](https://github.com/bloom-housing/bloom/issues/2294) [#2277](https://github.com/bloom-housing/bloom/issues/2277) [#2290](https://github.com/bloom-housing/bloom/issues/2290) [#2299](https://github.com/bloom-housing/bloom/issues/2299) [#2292](https://github.com/bloom-housing/bloom/issues/2292) [#2303](https://github.com/bloom-housing/bloom/issues/2303) [#2305](https://github.com/bloom-housing/bloom/issues/2305) [#2306](https://github.com/bloom-housing/bloom/issues/2306) [#2308](https://github.com/bloom-housing/bloom/issues/2308) [#2190](https://github.com/bloom-housing/bloom/issues/2190) [#2239](https://github.com/bloom-housing/bloom/issues/2239) [#2311](https://github.com/bloom-housing/bloom/issues/2311) [#2302](https://github.com/bloom-housing/bloom/issues/2302) [#2301](https://github.com/bloom-housing/bloom/issues/2301) [#1927](https://github.com/bloom-housing/bloom/issues/1927) [#2313](https://github.com/bloom-housing/bloom/issues/2313) [#2289](https://github.com/bloom-housing/bloom/issues/2289) [#2279](https://github.com/bloom-housing/bloom/issues/2279) [#2288](https://github.com/bloom-housing/bloom/issues/2288) [#2317](https://github.com/bloom-housing/bloom/issues/2317) [#2319](https://github.com/bloom-housing/bloom/issues/2319) [#2108](https://github.com/bloom-housing/bloom/issues/2108) [#2326](https://github.com/bloom-housing/bloom/issues/2326) [#2349](https://github.com/bloom-housing/bloom/issues/2349) [#2350](https://github.com/bloom-housing/bloom/issues/2350) [#2351](https://github.com/bloom-housing/bloom/issues/2351) [#2348](https://github.com/bloom-housing/bloom/issues/2348) [#2352](https://github.com/bloom-housing/bloom/issues/2352) [#2316](https://github.com/bloom-housing/bloom/issues/2316) [#2356](https://github.com/bloom-housing/bloom/issues/2356) [#2353](https://github.com/bloom-housing/bloom/issues/2353) [#2338](https://github.com/bloom-housing/bloom/issues/2338) [#2377](https://github.com/bloom-housing/bloom/issues/2377) [#2320](https://github.com/bloom-housing/bloom/issues/2320) [#2386](https://github.com/bloom-housing/bloom/issues/2386) [#2362](https://github.com/bloom-housing/bloom/issues/2362) [#2395](https://github.com/bloom-housing/bloom/issues/2395) [#2410](https://github.com/bloom-housing/bloom/issues/2410) [#2407](https://github.com/bloom-housing/bloom/issues/2407) [#2430](https://github.com/bloom-housing/bloom/issues/2430) [#2418](https://github.com/bloom-housing/bloom/issues/2418) [#2434](https://github.com/bloom-housing/bloom/issues/2434) [#2374](https://github.com/bloom-housing/bloom/issues/2374) [#2435](https://github.com/bloom-housing/bloom/issues/2435) [#2420](https://github.com/bloom-housing/bloom/issues/2420) [#2412](https://github.com/bloom-housing/bloom/issues/2412) [#2434](https://github.com/bloom-housing/bloom/issues/2434) [#2458](https://github.com/bloom-housing/bloom/issues/2458) [#2460](https://github.com/bloom-housing/bloom/issues/2460) [#2465](https://github.com/bloom-housing/bloom/issues/2465) [#2436](https://github.com/bloom-housing/bloom/issues/2436) [#2484](https://github.com/bloom-housing/bloom/issues/2484) [#2482](https://github.com/bloom-housing/bloom/issues/2482) [#2483](https://github.com/bloom-housing/bloom/issues/2483) [#2488](https://github.com/bloom-housing/bloom/issues/2488) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2519](https://github.com/bloom-housing/bloom/issues/2519) [#2506](https://github.com/bloom-housing/bloom/issues/2506) [#2534](https://github.com/bloom-housing/bloom/issues/2534) [#2544](https://github.com/bloom-housing/bloom/issues/2544) [#2550](https://github.com/bloom-housing/bloom/issues/2550) [#2288](https://github.com/bloom-housing/bloom/issues/2288) [#2317](https://github.com/bloom-housing/bloom/issues/2317) [#2319](https://github.com/bloom-housing/bloom/issues/2319) [#2108](https://github.com/bloom-housing/bloom/issues/2108) [#2326](https://github.com/bloom-housing/bloom/issues/2326) [#2349](https://github.com/bloom-housing/bloom/issues/2349) [#2350](https://github.com/bloom-housing/bloom/issues/2350) [#2351](https://github.com/bloom-housing/bloom/issues/2351) [#2348](https://github.com/bloom-housing/bloom/issues/2348) [#2352](https://github.com/bloom-housing/bloom/issues/2352) [#2316](https://github.com/bloom-housing/bloom/issues/2316) [#2356](https://github.com/bloom-housing/bloom/issues/2356) [#2353](https://github.com/bloom-housing/bloom/issues/2353) [#2338](https://github.com/bloom-housing/bloom/issues/2338) [#2377](https://github.com/bloom-housing/bloom/issues/2377) [#2320](https://github.com/bloom-housing/bloom/issues/2320) [#2386](https://github.com/bloom-housing/bloom/issues/2386) [#2362](https://github.com/bloom-housing/bloom/issues/2362) [#2395](https://github.com/bloom-housing/bloom/issues/2395) [#2410](https://github.com/bloom-housing/bloom/issues/2410) [#2407](https://github.com/bloom-housing/bloom/issues/2407) [#2430](https://github.com/bloom-housing/bloom/issues/2430) [#2418](https://github.com/bloom-housing/bloom/issues/2418) [#2434](https://github.com/bloom-housing/bloom/issues/2434) [#2374](https://github.com/bloom-housing/bloom/issues/2374) [#2435](https://github.com/bloom-housing/bloom/issues/2435) [#2420](https://github.com/bloom-housing/bloom/issues/2420) [#2412](https://github.com/bloom-housing/bloom/issues/2412) [#2438](https://github.com/bloom-housing/bloom/issues/2438) [#2429](https://github.com/bloom-housing/bloom/issues/2429) [#2452](https://github.com/bloom-housing/bloom/issues/2452) [#2458](https://github.com/bloom-housing/bloom/issues/2458) [#2423](https://github.com/bloom-housing/bloom/issues/2423) [#2432](https://github.com/bloom-housing/bloom/issues/2432) [#2437](https://github.com/bloom-housing/bloom/issues/2437) [#2440](https://github.com/bloom-housing/bloom/issues/2440) [#2441](https://github.com/bloom-housing/bloom/issues/2441) [#2460](https://github.com/bloom-housing/bloom/issues/2460) [#2459](https://github.com/bloom-housing/bloom/issues/2459) [#2464](https://github.com/bloom-housing/bloom/issues/2464) [#2465](https://github.com/bloom-housing/bloom/issues/2465) [#2466](https://github.com/bloom-housing/bloom/issues/2466) [#2436](https://github.com/bloom-housing/bloom/issues/2436) [#2451](https://github.com/bloom-housing/bloom/issues/2451) [#2415](https://github.com/bloom-housing/bloom/issues/2415) [#2354](https://github.com/bloom-housing/bloom/issues/2354) [#2455](https://github.com/bloom-housing/bloom/issues/2455) [#2484](https://github.com/bloom-housing/bloom/issues/2484) [#2482](https://github.com/bloom-housing/bloom/issues/2482) [#2483](https://github.com/bloom-housing/bloom/issues/2483) [#2476](https://github.com/bloom-housing/bloom/issues/2476) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2470](https://github.com/bloom-housing/bloom/issues/2470) [#2488](https://github.com/bloom-housing/bloom/issues/2488) [#2487](https://github.com/bloom-housing/bloom/issues/2487) [#2496](https://github.com/bloom-housing/bloom/issues/2496) [#2498](https://github.com/bloom-housing/bloom/issues/2498) [#2499](https://github.com/bloom-housing/bloom/issues/2499) [#2291](https://github.com/bloom-housing/bloom/issues/2291) [#2461](https://github.com/bloom-housing/bloom/issues/2461) [#2485](https://github.com/bloom-housing/bloom/issues/2485) [#2494](https://github.com/bloom-housing/bloom/issues/2494) [#2503](https://github.com/bloom-housing/bloom/issues/2503) [#2495](https://github.com/bloom-housing/bloom/issues/2495) [#2477](https://github.com/bloom-housing/bloom/issues/2477) [#2505](https://github.com/bloom-housing/bloom/issues/2505) [#2372](https://github.com/bloom-housing/bloom/issues/2372) [#2489](https://github.com/bloom-housing/bloom/issues/2489) [#2497](https://github.com/bloom-housing/bloom/issues/2497) [#2506](https://github.com/bloom-housing/bloom/issues/2506) [#2486](https://github.com/bloom-housing/bloom/issues/2486)


### BREAKING CHANGES

* preferences model and relationships changed

* feat: feat(backend): extend UserUpdateDto to support email change

picked from dev 3e1fdbd0ea91d4773973d5c485a5ba61303db90a

* fix: 2056/user account edit fix

picked from dev a15618c0cb548ff5b2ae913b802c9e08bb673f30

* refactor: 2085/adds top level catchAll exception filter

picked from dev aeaa63d1af1fa3d11671e169cb3bd23d356fface

* feat: feat: Change unit number field type to text

picked from dev f54be7c7ba6aac8e00fee610dc86584b60cc212d

* feat(backend): improve application flagged set saving efficiency

* fix: fix: updates address order

picked from dev 252e014dcbd2e4c305384ed552135f5a8e4e4767

* fix: sets programs to optoinal and updates versions

* chore: chore(deps): bump electron from 13.1.7 to 13.3.0

* chore: chore(deps): bump axios from 0.21.1 to 0.21.2

* fix: adds programs service

* fix: fix lisitng e2e tests

* fix: fix member tests

* fix: adds jurisdictionId to useSWR path

* fix: recalculate units available on listing update

picked form dev f1a3dbce6478b16542ed61ab20de5dfb9b797262

* feat: feat(backend): make use of new application confirmation codes

picked from dev 3c45c2904818200eed4568931d4cc352fd2f449e

* revert: revert "chore(deps): bump axios from 0.21.1 to 0.21.2

picked from dev 2b83bc0393afc42eed542e326d5ef75502ce119c

* fix: app submission w/ no due date

picked from dev 4af1f5a8448f16d347b4a65ecb85fda4d6ed71fc

* feat: adds new preferences, reserved community type

* feat: adds bottom border to preferences

* feat: updates preference string

* fix: preference cleanup for avance

* refactor: remove applicationAddress

picked from dev bf10632a62bf2f14922948c046ea3352ed010f4f

* feat: refactor and add public site application flow cypress tests

picked from dev 9ec0e8d05f9570773110754e7fdaf49254d1eab8

* feat: better seed data for ami-charts

picked from dev d8b1d4d185731a589c563a32bd592d01537785f3

* feat: adds listing management cypress tests to partner portal

* fix: listings management keep empty strings, remove empty objects

picked from dev c4b1e833ec128f457015ac7ffa421ee6047083d9

* feat: one month rent

picked from dev 883b0d53030e1c4d54f2f75bd5e188bb1d255f64

* test: view.spec.ts test

picked from dev 324446c90138d8fac50aba445f515009b5a58bfb

* refactor: removes jsonpath

picked from dev deb39acc005607ce3076942b1f49590d08afc10c

* feat: adds jurisdictions to pref seeds

picked from dev 9e47cec3b1acfe769207ccbb33c07019cd742e33

* feat: new demographics sub-race questions

picked from dev 9ab892694c1ad2fa8890b411b3b32af68ade1fc3

* feat: updates email confirmation for lottery

picked from dev 1a5e824c96d8e23674c32ea92688b9f7255528d3

* fix: add ariaHidden to Icon component

picked from dev c7bb86aec6fd5ad386c7ca50087d0113b14503be

* fix: add ariaLabel prop to Button component

picked from dev 509ddc898ba44c05e26f8ed8c777f1ba456eeee5

* fix: change the yes/no radio text to be more descriptive

picked from dev 0c46054574535523d6f217bb0677bbe732b8945f

* fix: remove alameda reference in demographics

picked from dev 7d5991cbf6dbe0b61f2b14d265e87ce3687f743d

* chore: release version

picked from dev fe82f25dc349877d974ae62d228fea0354978fb7

* feat: ami chart jurisdictionalized

picked from dev 0a5cbc88a9d9e3c2ff716fe0f44ca6c48f5dcc50

* refactor: make backend a peer dependency in ui-components

picked from dev 952aaa14a77e0960312ff0eeee51399d1d6af9f3

* feat: add a phone number column to the user_accounts table

picked from dev 2647df9ab9888a525cc8a164d091dda6482c502a

* chore: removes application program partners

* chore: removes application program display

* Revert "chore: removes application program display"

This reverts commit 14825b4a6c9cd1a7235e32074e32af18a71b5c26.

* Revert "chore: removes application program partners"

This reverts commit d7aa38c777972a2e21d9f816441caa27f98d3f86.

* chore: yarn.lock and backend-swagger

* fix: removes Duplicate identifier fieldGroupObjectToArray

* feat: skip preferences if not on listing

* chore(release): version

* fix: cannot save custom mailing, dropoff, or pickup address

* chore(release): version

* chore: converge on one axios version, remove peer dependency

* chore(release): version

* feat: simplify Waitlist component and use more flexible schema

* chore(release): version

* fix: lottery results uploads now save

* chore(release): version

* feat: add SRO unit type

* chore(release): version

* fix: paper application submission

* chore(release): version

* fix: choose-language context

* chore(release): version

* fix: applications/view hide prefs

* chore(release): version

* feat: overrides fallback to english, tagalog support

* chore(release): version

* fix: account translations

* chore(release): version

* fix: units with invalid ami chart

* chore(release): version

* fix: remove description for the partners programs

* fix: fix modal styles on mobile

* fix: visual improvement to programs form display

* fix: submission tests not running
* sign-in pages have been updated
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62





# [4.2.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@4.1.2...@bloom-housing/backend-core@4.2.0) (2022-04-06)


* 2022-04-05 release (#2627) ([485fb48](https://github.com/seanmalbert/bloom/commit/485fb48cfbad48bcabfef5e2e704025f608aee89)), closes [#2627](https://github.com/seanmalbert/bloom/issues/2627) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2438](https://github.com/seanmalbert/bloom/issues/2438) [#2429](https://github.com/seanmalbert/bloom/issues/2429) [#2452](https://github.com/seanmalbert/bloom/issues/2452) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2423](https://github.com/seanmalbert/bloom/issues/2423) [#2432](https://github.com/seanmalbert/bloom/issues/2432) [#2437](https://github.com/seanmalbert/bloom/issues/2437) [#2440](https://github.com/seanmalbert/bloom/issues/2440) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2505](https://github.com/seanmalbert/bloom/issues/2505) [#2372](https://github.com/seanmalbert/bloom/issues/2372) [#2489](https://github.com/seanmalbert/bloom/issues/2489) [#2497](https://github.com/seanmalbert/bloom/issues/2497) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2486](https://github.com/seanmalbert/bloom/issues/2486)
* 2022-04-04 release (#2614) ([fecab85](https://github.com/seanmalbert/bloom/commit/fecab85c748a55ab4aff5d591c8e0ac702254559)), closes [#2614](https://github.com/seanmalbert/bloom/issues/2614) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2438](https://github.com/seanmalbert/bloom/issues/2438) [#2429](https://github.com/seanmalbert/bloom/issues/2429) [#2452](https://github.com/seanmalbert/bloom/issues/2452) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2423](https://github.com/seanmalbert/bloom/issues/2423) [#2432](https://github.com/seanmalbert/bloom/issues/2432) [#2437](https://github.com/seanmalbert/bloom/issues/2437) [#2440](https://github.com/seanmalbert/bloom/issues/2440) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2505](https://github.com/seanmalbert/bloom/issues/2505) [#2372](https://github.com/seanmalbert/bloom/issues/2372) [#2489](https://github.com/seanmalbert/bloom/issues/2489) [#2497](https://github.com/seanmalbert/bloom/issues/2497) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2486](https://github.com/seanmalbert/bloom/issues/2486)


### BREAKING CHANGES

* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62





## [4.1.3-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.1.3-alpha.0...@bloom-housing/backend-core@4.1.3-alpha.1) (2022-04-04)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.1.3-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.1.1-alpha.3...@bloom-housing/backend-core@4.1.3-alpha.0) (2022-03-30)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.1.2](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@4.1.0...@bloom-housing/backend-core@4.1.2) (2022-03-29)

### Features

* temp disable terms and set mfa enabled to false ([#2595](https://github.com/seanmalbert/bloom/issues/2595)) ([6de2dcd](https://github.com/seanmalbert/bloom/commit/6de2dcd8baeb28166d7a6c383846a7ab9a84b0e2))



## [4.1.1-alpha.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.1.1-alpha.2...@bloom-housing/backend-core@4.1.1-alpha.3) (2022-03-29)

**Note:** Version bump only for package @bloom-housing/backend-core





## [4.1.1-alpha.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.1.1-alpha.1...@bloom-housing/backend-core@4.1.1-alpha.2) (2022-03-28)


### Features

* adds partners re-request confirmation ([#2574](https://github.com/bloom-housing/bloom/issues/2574)) ([235af78](https://github.com/bloom-housing/bloom/commit/235af781914e5c36104bb3862dd55152a16e6750)), closes [#2577](https://github.com/bloom-housing/bloom/issues/2577)





## [4.1.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@4.1.1-alpha.0...@bloom-housing/backend-core@4.1.1-alpha.1) (2022-03-25)


### Bug Fixes

* update for subject line ([#2578](https://github.com/bloom-housing/bloom/issues/2578)) ([dace763](https://github.com/bloom-housing/bloom/commit/dace76332bbdb3ad104638f32a07e71fd85edc0c))
* update to mfa text's text ([#2579](https://github.com/bloom-housing/bloom/issues/2579)) ([ac5b812](https://github.com/bloom-housing/bloom/commit/ac5b81242f3177de09ed176a60f06be871906178))





## [4.1.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2...@bloom-housing/backend-core@4.1.1-alpha.0) (2022-03-02)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.45...@bloom-housing/backend-core@3.0.2) (2022-03-02)

**Note:** Version bump only for package @bloom-housing/backend-core
# [4.1.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@4.0.3...@bloom-housing/backend-core@4.1.0) (2022-03-02)


* 2022-03-01 release (#2550) ([2f2264c](https://github.com/seanmalbert/bloom/commit/2f2264cffe41d0cc1ebb79ef5c894458694d9340)), closes [#2550](https://github.com/seanmalbert/bloom/issues/2550) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2438](https://github.com/seanmalbert/bloom/issues/2438) [#2429](https://github.com/seanmalbert/bloom/issues/2429) [#2452](https://github.com/seanmalbert/bloom/issues/2452) [#2458](https://github.com/seanmalbert/bloom/issues/2458) [#2423](https://github.com/seanmalbert/bloom/issues/2423) [#2432](https://github.com/seanmalbert/bloom/issues/2432) [#2437](https://github.com/seanmalbert/bloom/issues/2437) [#2440](https://github.com/seanmalbert/bloom/issues/2440) [#2441](https://github.com/seanmalbert/bloom/issues/2441) [#2460](https://github.com/seanmalbert/bloom/issues/2460) [#2459](https://github.com/seanmalbert/bloom/issues/2459) [#2464](https://github.com/seanmalbert/bloom/issues/2464) [#2465](https://github.com/seanmalbert/bloom/issues/2465) [#2466](https://github.com/seanmalbert/bloom/issues/2466) [#2436](https://github.com/seanmalbert/bloom/issues/2436) [#2451](https://github.com/seanmalbert/bloom/issues/2451) [#2415](https://github.com/seanmalbert/bloom/issues/2415) [#2354](https://github.com/seanmalbert/bloom/issues/2354) [#2455](https://github.com/seanmalbert/bloom/issues/2455) [#2484](https://github.com/seanmalbert/bloom/issues/2484) [#2482](https://github.com/seanmalbert/bloom/issues/2482) [#2483](https://github.com/seanmalbert/bloom/issues/2483) [#2476](https://github.com/seanmalbert/bloom/issues/2476) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2470](https://github.com/seanmalbert/bloom/issues/2470) [#2488](https://github.com/seanmalbert/bloom/issues/2488) [#2487](https://github.com/seanmalbert/bloom/issues/2487) [#2496](https://github.com/seanmalbert/bloom/issues/2496) [#2498](https://github.com/seanmalbert/bloom/issues/2498) [#2499](https://github.com/seanmalbert/bloom/issues/2499) [#2291](https://github.com/seanmalbert/bloom/issues/2291) [#2461](https://github.com/seanmalbert/bloom/issues/2461) [#2485](https://github.com/seanmalbert/bloom/issues/2485) [#2494](https://github.com/seanmalbert/bloom/issues/2494) [#2503](https://github.com/seanmalbert/bloom/issues/2503) [#2495](https://github.com/seanmalbert/bloom/issues/2495) [#2477](https://github.com/seanmalbert/bloom/issues/2477) [#2505](https://github.com/seanmalbert/bloom/issues/2505) [#2372](https://github.com/seanmalbert/bloom/issues/2372) [#2489](https://github.com/seanmalbert/bloom/issues/2489) [#2497](https://github.com/seanmalbert/bloom/issues/2497) [#2506](https://github.com/seanmalbert/bloom/issues/2506) [#2486](https://github.com/seanmalbert/bloom/issues/2486)


### BREAKING CHANGES

* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.38
 - @bloom-housing/shared-helpers@4.0.1-alpha.63
 - @bloom-housing/partners@4.0.1-alpha.67
 - @bloom-housing/public@4.0.1-alpha.66
 - @bloom-housing/ui-components@4.0.1-alpha.62





## [3.0.2-alpha.45](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.44...@bloom-housing/backend-core@3.0.2-alpha.45) (2022-02-28)


### Features

* updates to mfa styling ([#2532](https://github.com/bloom-housing/bloom/issues/2532)) ([7654efc](https://github.com/bloom-housing/bloom/commit/7654efc8a7c5cba0f7436fda62b886f646fe8a03))





## [4.0.3](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@4.0.2...@bloom-housing/backend-core@4.0.3) (2022-02-25)


### Bug Fixes

* csv export auth check ([#2488](https://github.com/seanmalbert/bloom/issues/2488)) ([6faf8f5](https://github.com/seanmalbert/bloom/commit/6faf8f59b115adf73e70d56c855ba5b6d325d22a))

### Features

* Add San Jose email translations ([#2519](https://github.com/seanmalbert/bloom/issues/2519)) ([d1db032](https://github.com/seanmalbert/bloom/commit/d1db032672f40d325eba9e4a833d24f8b02464cc))
* **backend:** fix translations table relation to jurisdiction ([#2506](https://github.com/seanmalbert/bloom/issues/2506)) ([22b9f23](https://github.com/seanmalbert/bloom/commit/22b9f23eb405f701796193515dff35058cc4f7dc))





## [3.0.2-alpha.44](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.43...@bloom-housing/backend-core@3.0.2-alpha.44) (2022-02-22)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.43](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.42...@bloom-housing/backend-core@3.0.2-alpha.43) (2022-02-17)


### Features

* adds NULLS LAST to mostRecentlyClosed ([#2521](https://github.com/bloom-housing/bloom/issues/2521)) ([39737a3](https://github.com/bloom-housing/bloom/commit/39737a3207e22815d184fc19cb2eaf6b6390dda8))





## [3.0.2-alpha.42](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.41...@bloom-housing/backend-core@3.0.2-alpha.42) (2022-02-17)


### Features

* **backend:** add listing order by mostRecentlyClosed param ([#2478](https://github.com/bloom-housing/bloom/issues/2478)) ([0f177c1](https://github.com/bloom-housing/bloom/commit/0f177c1847ac254f63837b0aca7fa8a705e3632c))





## [3.0.2-alpha.41](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.40...@bloom-housing/backend-core@3.0.2-alpha.41) (2022-02-16)


### Features

* **backend:** fix translations table relation to jurisdiction (make … ([#2506](https://github.com/bloom-housing/bloom/issues/2506)) ([8e1e3a9](https://github.com/bloom-housing/bloom/commit/8e1e3a9eb0ff76412831e122390ac25ad7754645))





## [3.0.2-alpha.40](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.39...@bloom-housing/backend-core@3.0.2-alpha.40) (2022-02-16)


### Bug Fixes

* checks for existance of image_id ([#2505](https://github.com/bloom-housing/bloom/issues/2505)) ([d2051af](https://github.com/bloom-housing/bloom/commit/d2051afa188ce62c42f3d6bf737fd2059f9b7599))





## [3.0.2-alpha.39](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.38...@bloom-housing/backend-core@3.0.2-alpha.39) (2022-02-15)


### Features

* **backend:** make listing image an array ([#2477](https://github.com/bloom-housing/bloom/issues/2477)) ([cab9800](https://github.com/bloom-housing/bloom/commit/cab98003e640c880be2218fa42321eadeec35e9c))





## [3.0.2-alpha.38](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.37...@bloom-housing/backend-core@3.0.2-alpha.38) (2022-02-15)


### Code Refactoring

* remove backend dependencies from events components, consolidate ([#2495](https://github.com/bloom-housing/bloom/issues/2495)) ([d884689](https://github.com/bloom-housing/bloom/commit/d88468965bc67c74b8b3eaced20c77472e90331f))


### BREAKING CHANGES

* consolidated all event section components in one new component, uptake will require removing the deprecated components and uptaking EventSection





## [3.0.2-alpha.37](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.36...@bloom-housing/backend-core@3.0.2-alpha.37) (2022-02-15)


### Bug Fixes

* **backend:** mfa_enabled migration fix ([#2503](https://github.com/bloom-housing/bloom/issues/2503)) ([a5b9a60](https://github.com/bloom-housing/bloom/commit/a5b9a604faccef55775dbbc54441251e29999fa4))





## [3.0.2-alpha.36](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.35...@bloom-housing/backend-core@3.0.2-alpha.36) (2022-02-15)


### Features

* **backend:** add partners portal users multi factor authentication ([#2291](https://github.com/bloom-housing/bloom/issues/2291)) ([5b10098](https://github.com/bloom-housing/bloom/commit/5b10098d8668f9f42c60e90236db16d6cc517793)), closes [#2461](https://github.com/bloom-housing/bloom/issues/2461) [#2485](https://github.com/bloom-housing/bloom/issues/2485)





## [3.0.2-alpha.35](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.34...@bloom-housing/backend-core@3.0.2-alpha.35) (2022-02-10)


### Bug Fixes

* csv export auth check ([#2488](https://github.com/bloom-housing/bloom/issues/2488)) ([2471d4a](https://github.com/bloom-housing/bloom/commit/2471d4afdd747843f58c0c154d6e94a9c76d733d))





## [3.0.2-alpha.34](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.33...@bloom-housing/backend-core@3.0.2-alpha.34) (2022-02-10)

**Note:** Version bump only for package @bloom-housing/backend-core




## [4.0.2](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@4.0.1...@bloom-housing/backend-core@4.0.2) (2022-02-09)


### Bug Fixes

* updates partner check for listing perm ([#2484](https://github.com/seanmalbert/bloom/issues/2484)) ([c2ab01f](https://github.com/seanmalbert/bloom/commit/c2ab01f6520b138bead01dec7352618b90635432))





## [3.0.2-alpha.33](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.32...@bloom-housing/backend-core@3.0.2-alpha.33) (2022-02-09)


### Features

* **backend:** remove assigning partner user as an application owner ([#2476](https://github.com/bloom-housing/bloom/issues/2476)) ([4f6edf7](https://github.com/bloom-housing/bloom/commit/4f6edf7ed882ae926e363e4db4e40e6f19ed4746))





## [3.0.2-alpha.32](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.31...@bloom-housing/backend-core@3.0.2-alpha.32) (2022-02-09)


### Bug Fixes

* updates partner check for listing perm ([#2484](https://github.com/bloom-housing/bloom/issues/2484)) ([9b0a6f5](https://github.com/bloom-housing/bloom/commit/9b0a6f560ec5dd95f846b330afb71eed40cbfa1b))





## [3.0.2-alpha.31](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.30...@bloom-housing/backend-core@3.0.2-alpha.31) (2022-02-09)


### Bug Fixes

* cannot remove some fields in listings management ([#2455](https://github.com/bloom-housing/bloom/issues/2455)) ([acd9b51](https://github.com/bloom-housing/bloom/commit/acd9b51bb49581b4728b445d56c5c0a3c43e2777))





## [3.0.2-alpha.30](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.29...@bloom-housing/backend-core@3.0.2-alpha.30) (2022-02-07)

**Note:** Version bump only for package @bloom-housing/backend-core




## [4.0.1](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.23...@bloom-housing/backend-core@4.0.1) (2022-02-03)

### Bug Fixes

* ami charts without all households ([#2430](https://github.com/seanmalbert/bloom/issues/2430)) ([5e18eba](https://github.com/seanmalbert/bloom/commit/5e18eba1d24bff038b192477b72d9d3f1f05a39d))
* app submission w/ no due date ([8e5a81c](https://github.com/seanmalbert/bloom/commit/8e5a81c37c4efc3404e5536bd54c10cd2962bca3))
* await casbin enforcer ([d7eb196](https://github.com/seanmalbert/bloom/commit/d7eb196be0b05732325938e2db7b583d66cbc9cf))
* cannot save custom mailing, dropoff, or pickup address ([edcb068](https://github.com/seanmalbert/bloom/commit/edcb068ca23411e0a34f1dc2ff4c77ab489ac0fc))
* fix for csv dempgraphics and preference patch ([0ffc090](https://github.com/seanmalbert/bloom/commit/0ffc0900fee73b34fd953e5355552e2e763c239c))
* listings management keep empty strings, remove empty objects ([3aba274](https://github.com/seanmalbert/bloom/commit/3aba274a751cdb2db55b65ade1cda5d1689ca681))
* patches translations for preferences ([#2410](https://github.com/seanmalbert/bloom/issues/2410)) ([21f517e](https://github.com/seanmalbert/bloom/commit/21f517e3f62dc5fefc8b4031d8915c8d7690677d))
* recalculate units available on listing update ([9c3967f](https://github.com/seanmalbert/bloom/commit/9c3967f0b74526db39df4f5dbc7ad9a52741a6ea))
* units with invalid ami chart ([621ff02](https://github.com/seanmalbert/bloom/commit/621ff0227270861047e885467f9ddd77459adec1))
* updates household member count ([f822713](https://github.com/seanmalbert/bloom/commit/f82271397d02025629d7ea039b40cdac95877c45))


* 2022-01-27 release (#2439) ([860f6af](https://github.com/seanmalbert/bloom/commit/860f6af6204903e4dcddf671d7ba54f3ec04f121)), closes [#2439](https://github.com/seanmalbert/bloom/issues/2439) [#2196](https://github.com/seanmalbert/bloom/issues/2196) [#2238](https://github.com/seanmalbert/bloom/issues/2238) [#2226](https://github.com/seanmalbert/bloom/issues/2226) [#2230](https://github.com/seanmalbert/bloom/issues/2230) [#2243](https://github.com/seanmalbert/bloom/issues/2243) [#2195](https://github.com/seanmalbert/bloom/issues/2195) [#2215](https://github.com/seanmalbert/bloom/issues/2215) [#2266](https://github.com/seanmalbert/bloom/issues/2266) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2270](https://github.com/seanmalbert/bloom/issues/2270) [#2188](https://github.com/seanmalbert/bloom/issues/2188) [#2213](https://github.com/seanmalbert/bloom/issues/2213) [#2234](https://github.com/seanmalbert/bloom/issues/2234) [#1901](https://github.com/seanmalbert/bloom/issues/1901) [#2260](https://github.com/seanmalbert/bloom/issues/2260) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2280](https://github.com/seanmalbert/bloom/issues/2280) [#2253](https://github.com/seanmalbert/bloom/issues/2253) [#2276](https://github.com/seanmalbert/bloom/issues/2276) [#2282](https://github.com/seanmalbert/bloom/issues/2282) [#2262](https://github.com/seanmalbert/bloom/issues/2262) [#2278](https://github.com/seanmalbert/bloom/issues/2278) [#2293](https://github.com/seanmalbert/bloom/issues/2293) [#2295](https://github.com/seanmalbert/bloom/issues/2295) [#2296](https://github.com/seanmalbert/bloom/issues/2296) [#2294](https://github.com/seanmalbert/bloom/issues/2294) [#2277](https://github.com/seanmalbert/bloom/issues/2277) [#2290](https://github.com/seanmalbert/bloom/issues/2290) [#2299](https://github.com/seanmalbert/bloom/issues/2299) [#2292](https://github.com/seanmalbert/bloom/issues/2292) [#2303](https://github.com/seanmalbert/bloom/issues/2303) [#2305](https://github.com/seanmalbert/bloom/issues/2305) [#2306](https://github.com/seanmalbert/bloom/issues/2306) [#2308](https://github.com/seanmalbert/bloom/issues/2308) [#2190](https://github.com/seanmalbert/bloom/issues/2190) [#2239](https://github.com/seanmalbert/bloom/issues/2239) [#2311](https://github.com/seanmalbert/bloom/issues/2311) [#2302](https://github.com/seanmalbert/bloom/issues/2302) [#2301](https://github.com/seanmalbert/bloom/issues/2301) [#1927](https://github.com/seanmalbert/bloom/issues/1927) [#2313](https://github.com/seanmalbert/bloom/issues/2313) [#2289](https://github.com/seanmalbert/bloom/issues/2289) [#2279](https://github.com/seanmalbert/bloom/issues/2279) [#2288](https://github.com/seanmalbert/bloom/issues/2288) [#2317](https://github.com/seanmalbert/bloom/issues/2317) [#2319](https://github.com/seanmalbert/bloom/issues/2319) [#2108](https://github.com/seanmalbert/bloom/issues/2108) [#2326](https://github.com/seanmalbert/bloom/issues/2326) [#2349](https://github.com/seanmalbert/bloom/issues/2349) [#2350](https://github.com/seanmalbert/bloom/issues/2350) [#2351](https://github.com/seanmalbert/bloom/issues/2351) [#2348](https://github.com/seanmalbert/bloom/issues/2348) [#2352](https://github.com/seanmalbert/bloom/issues/2352) [#2316](https://github.com/seanmalbert/bloom/issues/2316) [#2356](https://github.com/seanmalbert/bloom/issues/2356) [#2353](https://github.com/seanmalbert/bloom/issues/2353) [#2338](https://github.com/seanmalbert/bloom/issues/2338) [#2377](https://github.com/seanmalbert/bloom/issues/2377) [#2320](https://github.com/seanmalbert/bloom/issues/2320) [#2386](https://github.com/seanmalbert/bloom/issues/2386) [#2362](https://github.com/seanmalbert/bloom/issues/2362) [#2395](https://github.com/seanmalbert/bloom/issues/2395) [#2410](https://github.com/seanmalbert/bloom/issues/2410) [#2407](https://github.com/seanmalbert/bloom/issues/2407) [#2430](https://github.com/seanmalbert/bloom/issues/2430) [#2418](https://github.com/seanmalbert/bloom/issues/2418) [#2434](https://github.com/seanmalbert/bloom/issues/2434) [#2374](https://github.com/seanmalbert/bloom/issues/2374) [#2435](https://github.com/seanmalbert/bloom/issues/2435) [#2420](https://github.com/seanmalbert/bloom/issues/2420) [#2412](https://github.com/seanmalbert/bloom/issues/2412) [#2434](https://github.com/seanmalbert/bloom/issues/2434)
* Release 11 11 21 (#2162) ([4847469](https://github.com/seanmalbert/bloom/commit/484746982e440c1c1c87c85089d86cd5968f1cae)), closes [#2162](https://github.com/seanmalbert/bloom/issues/2162)

### Features

* add a phone number column to the user_accounts table ([44881da](https://github.com/seanmalbert/bloom/commit/44881da1a7ccc17b7d4db1fcf79513632c18066d))
* add SRO unit type ([a4c1403](https://github.com/seanmalbert/bloom/commit/a4c140350a84a5bacfa65fb6714aa594e406945d))
* adds jurisdictions to pref seeds ([8a70b68](https://github.com/seanmalbert/bloom/commit/8a70b688ec8c6eb785543d5ce91ae182f62af168))
* adds new preferences, reserved community type ([90c0673](https://github.com/seanmalbert/bloom/commit/90c0673779eeb028041717d0b1e0e69fb0766c71))
* adds whatToExpect to GTrans ([461961a](https://github.com/seanmalbert/bloom/commit/461961a4dd48d7a1c935e4dc03e9a62d2f455088))
* adds whatToExpect to GTrans ([#2303](https://github.com/seanmalbert/bloom/issues/2303)) ([38e672a](https://github.com/seanmalbert/bloom/commit/38e672a4dbd6c39a7a01b04698f2096a62eed8a1))
* ami chart jurisdictionalized ([b2e2537](https://github.com/seanmalbert/bloom/commit/b2e2537818d92ff41ea51fbbeb23d9d7e8c1cf52))
* **backend:** add storing listing translations ([#2215](https://github.com/seanmalbert/bloom/issues/2215)) ([d6a1337](https://github.com/seanmalbert/bloom/commit/d6a1337fbe3da8a159e2b60638fc527aa65aaef0))
* **backend:** all programs to csv export ([#2302](https://github.com/seanmalbert/bloom/issues/2302)) ([48b50f9](https://github.com/seanmalbert/bloom/commit/48b50f95be794773cc68ebee3144c1f44db26f04))
* better seed data for ami-charts ([24eb7e4](https://github.com/seanmalbert/bloom/commit/24eb7e41512963f8dc716b74e8a8684e1272e1b7))
* feat(backend): make use of new application confirmation codes ([8f386e8](https://github.com/seanmalbert/bloom/commit/8f386e8e656c8d498d41de947f2e5246d3c16b19))
* new demographics sub-race questions ([910df6a](https://github.com/seanmalbert/bloom/commit/910df6ad3985980becdc2798076ed5dfeeb310b5))
* one month rent ([319743d](https://github.com/seanmalbert/bloom/commit/319743d23268f5b55e129c0878510edb4204b668))
* overrides fallback to english, tagalog support ([b79fd10](https://github.com/seanmalbert/bloom/commit/b79fd1018619f618bd9be8e870d35c1180b81dfb))
* updates email confirmation for lottery ([768064a](https://github.com/seanmalbert/bloom/commit/768064a985ed858fae681caebcbcdb561319eaf9))


### Reverts

* Revert "chore: removes application program partners" ([91e22d8](https://github.com/seanmalbert/bloom/commit/91e22d891104e8d4fc024d709a6a14cec1400733))
* Revert "chore: removes application program display" ([740cf00](https://github.com/seanmalbert/bloom/commit/740cf00dc3a729eed037d56a8dfc5988decd2651))

### BREAKING CHANGES

* sign-in pages have been updated
* moved some helpers from ui-components to shared-helpers
* remove applicationDueTime field and consolidated into applicationDueDate

* chore(release): version

 - @bloom-housing/backend-core@3.0.2-alpha.13
 - @bloom-housing/shared-helpers@4.0.1-alpha.21
 - @bloom-housing/partners@4.0.1-alpha.23
 - @bloom-housing/public@4.0.1-alpha.22
 - @bloom-housing/ui-components@4.0.1-alpha.21
* preferences model and relationships changed

* feat: feat(backend): extend UserUpdateDto to support email change

picked from dev 3e1fdbd0ea91d4773973d5c485a5ba61303db90a

* fix: 2056/user account edit fix

picked from dev a15618c0cb548ff5b2ae913b802c9e08bb673f30

* refactor: 2085/adds top level catchAll exception filter

picked from dev aeaa63d1af1fa3d11671e169cb3bd23d356fface

* feat: feat: Change unit number field type to text

picked from dev f54be7c7ba6aac8e00fee610dc86584b60cc212d

* feat(backend): improve application flagged set saving efficiency

* fix: fix: updates address order

picked from dev 252e014dcbd2e4c305384ed552135f5a8e4e4767

* fix: sets programs to optoinal and updates versions

* chore: chore(deps): bump electron from 13.1.7 to 13.3.0

* chore: chore(deps): bump axios from 0.21.1 to 0.21.2

* fix: adds programs service

* fix: fix lisitng e2e tests

* fix: fix member tests





## [3.0.2-alpha.29](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.28...@bloom-housing/backend-core@3.0.2-alpha.29) (2022-02-02)


### Bug Fixes

* unit accordion radio button not showing default value ([#2451](https://github.com/bloom-housing/bloom/issues/2451)) ([4ed8103](https://github.com/bloom-housing/bloom/commit/4ed81039b9130d0433b11df2bdabc495ce2b9f24))





## [3.0.2-alpha.28](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.27...@bloom-housing/backend-core@3.0.2-alpha.28) (2022-02-02)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.27](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.26...@bloom-housing/backend-core@3.0.2-alpha.27) (2022-02-02)


### Bug Fixes

* **backend:** translations input validator ([#2466](https://github.com/bloom-housing/bloom/issues/2466)) ([603c3dc](https://github.com/bloom-housing/bloom/commit/603c3dc52a400db815c4d81552a5aa74f397fe0f))





## [3.0.2-alpha.26](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.25...@bloom-housing/backend-core@3.0.2-alpha.26) (2022-02-02)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.25](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.24...@bloom-housing/backend-core@3.0.2-alpha.25) (2022-02-01)


### Bug Fixes

* date validation issue ([#2464](https://github.com/bloom-housing/bloom/issues/2464)) ([158f7bf](https://github.com/bloom-housing/bloom/commit/158f7bf7fdc59954aebfebbd1ad3741239ed1a35))





## [3.0.2-alpha.24](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.23...@bloom-housing/backend-core@3.0.2-alpha.24) (2022-02-01)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.23](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.22...@bloom-housing/backend-core@3.0.2-alpha.23) (2022-02-01)


### Bug Fixes

* await casbin enforcer ([4feacec](https://github.com/bloom-housing/bloom/commit/4feacec44635135bc5469c0edd02a3424a2697cc))





## [3.0.2-alpha.22](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.21...@bloom-housing/backend-core@3.0.2-alpha.22) (2022-02-01)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.21](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.20...@bloom-housing/backend-core@3.0.2-alpha.21) (2022-02-01)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.20](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.19...@bloom-housing/backend-core@3.0.2-alpha.20) (2022-02-01)


### Features

* **backend:** add publishedAt and closedAt to listing entity ([#2432](https://github.com/bloom-housing/bloom/issues/2432)) ([f3b0f86](https://github.com/bloom-housing/bloom/commit/f3b0f864a6d5d2ad3d886e828743454c3e8fca71))





## [3.0.2-alpha.19](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.18...@bloom-housing/backend-core@3.0.2-alpha.19) (2022-02-01)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.18](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.17...@bloom-housing/backend-core@3.0.2-alpha.18) (2022-01-31)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.17](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.16...@bloom-housing/backend-core@3.0.2-alpha.17) (2022-01-27)


### Features

* outdated password messaging updates ([b14e19d](https://github.com/bloom-housing/bloom/commit/b14e19d43099af2ba721d8aaaeeb2be886d05111))





## [3.0.2-alpha.16](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.15...@bloom-housing/backend-core@3.0.2-alpha.16) (2022-01-24)


### Bug Fixes

* ami charts without all households ([#2430](https://github.com/bloom-housing/bloom/issues/2430)) ([92dfbad](https://github.com/bloom-housing/bloom/commit/92dfbad32c90d84ee1ec3a3468c084cb110aa8be))





## [3.0.2-alpha.15](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.14...@bloom-housing/backend-core@3.0.2-alpha.15) (2022-01-14)


### Bug Fixes

* patches translations for preferences ([#2410](https://github.com/bloom-housing/bloom/issues/2410)) ([7906e6b](https://github.com/bloom-housing/bloom/commit/7906e6bc035fab4deea79ea51833a0ef29926d45))




## [3.0.1](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.23...@bloom-housing/backend-core@3.0.1) (2022-01-13)

### Bug Fixes

* app submission w/ no due date ([8e5a81c](https://github.com/seanmalbert/bloom/commit/8e5a81c37c4efc3404e5536bd54c10cd2962bca3))
* cannot save custom mailing, dropoff, or pickup address ([edcb068](https://github.com/seanmalbert/bloom/commit/edcb068ca23411e0a34f1dc2ff4c77ab489ac0fc))
* fix for csv dempgraphics and preference patch ([0ffc090](https://github.com/seanmalbert/bloom/commit/0ffc0900fee73b34fd953e5355552e2e763c239c))
* listings management keep empty strings, remove empty objects ([3aba274](https://github.com/seanmalbert/bloom/commit/3aba274a751cdb2db55b65ade1cda5d1689ca681))
* recalculate units available on listing update ([9c3967f](https://github.com/seanmalbert/bloom/commit/9c3967f0b74526db39df4f5dbc7ad9a52741a6ea))
* units with invalid ami chart ([621ff02](https://github.com/seanmalbert/bloom/commit/621ff0227270861047e885467f9ddd77459adec1))
* updates household member count ([f822713](https://github.com/seanmalbert/bloom/commit/f82271397d02025629d7ea039b40cdac95877c45))


* Release 11 11 21 (#2162) ([4847469](https://github.com/seanmalbert/bloom/commit/484746982e440c1c1c87c85089d86cd5968f1cae)), closes [#2162](https://github.com/seanmalbert/bloom/issues/2162)

### Features

* add a phone number column to the user_accounts table ([44881da](https://github.com/seanmalbert/bloom/commit/44881da1a7ccc17b7d4db1fcf79513632c18066d))
* add SRO unit type ([a4c1403](https://github.com/seanmalbert/bloom/commit/a4c140350a84a5bacfa65fb6714aa594e406945d))
* adds jurisdictions to pref seeds ([8a70b68](https://github.com/seanmalbert/bloom/commit/8a70b688ec8c6eb785543d5ce91ae182f62af168))
* adds new preferences, reserved community type ([90c0673](https://github.com/seanmalbert/bloom/commit/90c0673779eeb028041717d0b1e0e69fb0766c71))
* adds whatToExpect to GTrans ([461961a](https://github.com/seanmalbert/bloom/commit/461961a4dd48d7a1c935e4dc03e9a62d2f455088))
* ami chart jurisdictionalized ([b2e2537](https://github.com/seanmalbert/bloom/commit/b2e2537818d92ff41ea51fbbeb23d9d7e8c1cf52))
* **backend:** all programs to csv export ([#2302](https://github.com/seanmalbert/bloom/issues/2302)) ([48b50f9](https://github.com/seanmalbert/bloom/commit/48b50f95be794773cc68ebee3144c1f44db26f04))
* better seed data for ami-charts ([24eb7e4](https://github.com/seanmalbert/bloom/commit/24eb7e41512963f8dc716b74e8a8684e1272e1b7))
* feat(backend): make use of new application confirmation codes ([8f386e8](https://github.com/seanmalbert/bloom/commit/8f386e8e656c8d498d41de947f2e5246d3c16b19))
* new demographics sub-race questions ([910df6a](https://github.com/seanmalbert/bloom/commit/910df6ad3985980becdc2798076ed5dfeeb310b5))
* one month rent ([319743d](https://github.com/seanmalbert/bloom/commit/319743d23268f5b55e129c0878510edb4204b668))
* overrides fallback to english, tagalog support ([b79fd10](https://github.com/seanmalbert/bloom/commit/b79fd1018619f618bd9be8e870d35c1180b81dfb))
* updates email confirmation for lottery ([768064a](https://github.com/seanmalbert/bloom/commit/768064a985ed858fae681caebcbcdb561319eaf9))


### Reverts

* Revert "chore: removes application program partners" ([91e22d8](https://github.com/seanmalbert/bloom/commit/91e22d891104e8d4fc024d709a6a14cec1400733))
* Revert "chore: removes application program display" ([740cf00](https://github.com/seanmalbert/bloom/commit/740cf00dc3a729eed037d56a8dfc5988decd2651))


### BREAKING CHANGES

* preferences model and relationships changed

* feat: feat(backend): extend UserUpdateDto to support email change

picked from dev 3e1fdbd0ea91d4773973d5c485a5ba61303db90a

* fix: 2056/user account edit fix

picked from dev a15618c0cb548ff5b2ae913b802c9e08bb673f30

* refactor: 2085/adds top level catchAll exception filter

picked from dev aeaa63d1af1fa3d11671e169cb3bd23d356fface

* feat: feat: Change unit number field type to text

picked from dev f54be7c7ba6aac8e00fee610dc86584b60cc212d

* feat(backend): improve application flagged set saving efficiency

* fix: fix: updates address order

picked from dev 252e014dcbd2e4c305384ed552135f5a8e4e4767

* fix: sets programs to optoinal and updates versions

* chore: chore(deps): bump electron from 13.1.7 to 13.3.0

* chore: chore(deps): bump axios from 0.21.1 to 0.21.2

* fix: adds programs service

* fix: fix lisitng e2e tests

* fix: fix member tests





## [3.0.2-alpha.14](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.13...@bloom-housing/backend-core@3.0.2-alpha.14) (2022-01-13)


### Bug Fixes

* partners render issue ([#2395](https://github.com/bloom-housing/bloom/issues/2395)) ([7fb108d](https://github.com/bloom-housing/bloom/commit/7fb108d744fcafd6b9df42706d2a2f58fbc30f0a))





## [3.0.2-alpha.13](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.12...@bloom-housing/backend-core@3.0.2-alpha.13) (2022-01-13)


### Bug Fixes

* dates showing as invalid in send by mail section ([#2362](https://github.com/bloom-housing/bloom/issues/2362)) ([3567388](https://github.com/bloom-housing/bloom/commit/35673882d87e2b524b2c94d1fb7b40c9d777f0a3))


### BREAKING CHANGES

* remove applicationDueTime field and consolidated into applicationDueDate





## [3.0.2-alpha.12](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.11...@bloom-housing/backend-core@3.0.2-alpha.12) (2022-01-07)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.11](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.10...@bloom-housing/backend-core@3.0.2-alpha.11) (2022-01-07)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.10](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.9...@bloom-housing/backend-core@3.0.2-alpha.10) (2022-01-04)


### Bug Fixes

* fix sortig on applications partner grid ([f097037](https://github.com/bloom-housing/bloom/commit/f097037afd896eec8bb90cc5e2de07f222907870))
* fixes linting error ([aaaf858](https://github.com/bloom-housing/bloom/commit/aaaf85822e3b03224fb336bae66209a2b6b88d1d))
* fixes some issues with the deployment ([a0042ba](https://github.com/bloom-housing/bloom/commit/a0042badc5474dde413e41a7f4f84c8ee7b2f8f1))
* fixes tests and also issue with user grid ([da07ba4](https://github.com/bloom-housing/bloom/commit/da07ba49459f77fe77e3f72555eb50a0cbaab095))





## [3.0.2-alpha.9](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.8...@bloom-housing/backend-core@3.0.2-alpha.9) (2022-01-04)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.8](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.7...@bloom-housing/backend-core@3.0.2-alpha.8) (2022-01-03)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1...@bloom-housing/backend-core@3.0.2-alpha.7) (2022-01-03)


### Bug Fixes

* bump version ([#2349](https://github.com/bloom-housing/bloom/issues/2349)) ([b9e3ba1](https://github.com/bloom-housing/bloom/commit/b9e3ba10aebd6534090f8be231a9ea77b3c929b6))
* bump version ([#2350](https://github.com/bloom-housing/bloom/issues/2350)) ([05863f5](https://github.com/bloom-housing/bloom/commit/05863f55f3939bea4387bd7cf4eb1f34df106124))
* check for user lastLoginAt ([d78745a](https://github.com/bloom-housing/bloom/commit/d78745a4c8b770864c4f5e6140ee602e745b8bec))


### Features

* **backend:** add appropriate http exception for password outdated login failure ([e5df66e](https://github.com/bloom-housing/bloom/commit/e5df66e4fe0f937f507d014f3b25c6c9b4b5deff))
* **backend:** add password outdating only to users which are either admins or partners ([754546d](https://github.com/bloom-housing/bloom/commit/754546dfd5194f8c30e12963031791818566d22d))
* **backend:** add user password expiration ([107c2f0](https://github.com/bloom-housing/bloom/commit/107c2f06e2f8367b52cb7cc8f00e6d9aef751fe0))
* **backend:** lock failed login attempts ([a8370ce](https://github.com/bloom-housing/bloom/commit/a8370ce1516f75180796d190a9a9f2697723e181))
* **backend:** remove activity log interceptor from update-password ([2e56b98](https://github.com/bloom-housing/bloom/commit/2e56b9878969604bec2f7694a83dbf7061af9df2))





## [3.0.2-alpha.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1...@bloom-housing/backend-core@3.0.2-alpha.6) (2022-01-03)


### Bug Fixes

* bump version ([#2349](https://github.com/bloom-housing/bloom/issues/2349)) ([b9e3ba1](https://github.com/bloom-housing/bloom/commit/b9e3ba10aebd6534090f8be231a9ea77b3c929b6))
* bump version ([#2350](https://github.com/bloom-housing/bloom/issues/2350)) ([05863f5](https://github.com/bloom-housing/bloom/commit/05863f55f3939bea4387bd7cf4eb1f34df106124))
* check for user lastLoginAt ([d78745a](https://github.com/bloom-housing/bloom/commit/d78745a4c8b770864c4f5e6140ee602e745b8bec))


### Features

* **backend:** add appropriate http exception for password outdated login failure ([e5df66e](https://github.com/bloom-housing/bloom/commit/e5df66e4fe0f937f507d014f3b25c6c9b4b5deff))
* **backend:** add password outdating only to users which are either admins or partners ([754546d](https://github.com/bloom-housing/bloom/commit/754546dfd5194f8c30e12963031791818566d22d))
* **backend:** add user password expiration ([107c2f0](https://github.com/bloom-housing/bloom/commit/107c2f06e2f8367b52cb7cc8f00e6d9aef751fe0))
* **backend:** lock failed login attempts ([a8370ce](https://github.com/bloom-housing/bloom/commit/a8370ce1516f75180796d190a9a9f2697723e181))
* **backend:** remove activity log interceptor from update-password ([2e56b98](https://github.com/bloom-housing/bloom/commit/2e56b9878969604bec2f7694a83dbf7061af9df2))





## [3.0.2-alpha.1](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@3.0.2-alpha.0...@bloom-housing/backend-core@3.0.2-alpha.1) (2021-12-23)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.2-alpha.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@3.0.1...@bloom-housing/backend-core@3.0.2-alpha.0) (2021-12-23)


### Features

* **backend:** lock failed login attempts ([a8370ce](https://github.com/seanmalbert/bloom/commit/a8370ce1516f75180796d190a9a9f2697723e181))





## [3.0.1](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.40...@bloom-housing/backend-core@3.0.1) (2021-12-22)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.40](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.39...@bloom-housing/backend-core@3.0.1-alpha.40) (2021-12-15)


### Features

* **backend:** refactor applications module ([#2279](https://github.com/bloom-housing/bloom/issues/2279)) ([e0b4523](https://github.com/bloom-housing/bloom/commit/e0b4523817c7d3863c3802d8a9f61d1a1c8685d4))





## [3.0.1-alpha.39](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.38...@bloom-housing/backend-core@3.0.1-alpha.39) (2021-12-14)


### Features

* removes ListingLangCacheInterceptor from get by id ([7acbd82](https://github.com/bloom-housing/bloom/commit/7acbd82485edfa9a8aa5a82473d5bbe5cee571e7))





## [3.0.1-alpha.38](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.37...@bloom-housing/backend-core@3.0.1-alpha.38) (2021-12-14)


### Features

* **backend:** add partnerTerms to jurisdiction entity ([#2301](https://github.com/bloom-housing/bloom/issues/2301)) ([7ecf3ef](https://github.com/bloom-housing/bloom/commit/7ecf3ef24f261bf6b42fc38cf0080251a3c60e89))





## [3.0.1-alpha.37](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.36...@bloom-housing/backend-core@3.0.1-alpha.37) (2021-12-13)


### Features

* **backend:** all programs to csv export ([#2302](https://github.com/bloom-housing/bloom/issues/2302)) ([f4d6a62](https://github.com/bloom-housing/bloom/commit/f4d6a62920e3b859310898e3a040f8116b43cab3))





## [3.0.1-alpha.36](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.35...@bloom-housing/backend-core@3.0.1-alpha.36) (2021-12-13)


### Features

* **backend:** add activity logging to listings module ([#2190](https://github.com/bloom-housing/bloom/issues/2190)) ([88d60e3](https://github.com/bloom-housing/bloom/commit/88d60e32d77381d6e830158ce77c058b1cfcc022))





## [3.0.1-alpha.35](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.34...@bloom-housing/backend-core@3.0.1-alpha.35) (2021-12-10)


### Features

* adds whatToExpect to GTrans ([#2303](https://github.com/bloom-housing/bloom/issues/2303)) ([6d7305b](https://github.com/bloom-housing/bloom/commit/6d7305b8e3b7e1c3a9776123e8e6d370ab803af0))





## [3.0.1-alpha.34](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.33...@bloom-housing/backend-core@3.0.1-alpha.34) (2021-12-09)


### Bug Fixes

* units with invalid ami chart ([#2290](https://github.com/bloom-housing/bloom/issues/2290)) ([a6516e1](https://github.com/bloom-housing/bloom/commit/a6516e142ec13db5c3c8d2bb4f726be681e172e3))





## [3.0.1-alpha.33](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.32...@bloom-housing/backend-core@3.0.1-alpha.33) (2021-12-07)


### Features

* overrides fallback to english, tagalog support ([#2262](https://github.com/bloom-housing/bloom/issues/2262)) ([679ab9b](https://github.com/bloom-housing/bloom/commit/679ab9b1816d5934f48f02ca5f5696952ef88ae7))





## [3.0.1-alpha.32](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.31...@bloom-housing/backend-core@3.0.1-alpha.32) (2021-12-06)


### Features

* **backend:** add listings closing routine ([#2213](https://github.com/bloom-housing/bloom/issues/2213)) ([a747806](https://github.com/bloom-housing/bloom/commit/a747806282f80c92bd9a171a2b4d5c9b74d3b49a))





## [3.0.1-alpha.31](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.30...@bloom-housing/backend-core@3.0.1-alpha.31) (2021-12-03)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.30](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.29...@bloom-housing/backend-core@3.0.1-alpha.30) (2021-12-03)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.29](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.28...@bloom-housing/backend-core@3.0.1-alpha.29) (2021-12-03)


### Features

* **backend:** add storing listing translations ([#2215](https://github.com/bloom-housing/bloom/issues/2215)) ([6ac63ea](https://github.com/bloom-housing/bloom/commit/6ac63eae82e14ab32d541b907c7e5dc800c1971f))





## [3.0.1-alpha.28](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.27...@bloom-housing/backend-core@3.0.1-alpha.28) (2021-12-01)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.27](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.26...@bloom-housing/backend-core@3.0.1-alpha.27) (2021-12-01)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.26](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.25...@bloom-housing/backend-core@3.0.1-alpha.26) (2021-11-30)


### Bug Fixes

* **backend:** nginx with heroku configuration ([#2196](https://github.com/bloom-housing/bloom/issues/2196)) ([a1e2630](https://github.com/bloom-housing/bloom/commit/a1e26303bdd660b9ac267da55dc8d09661216f1c))





## [3.0.1-alpha.25](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.24...@bloom-housing/backend-core@3.0.1-alpha.25) (2021-11-29)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.24](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.23...@bloom-housing/backend-core@3.0.1-alpha.24) (2021-11-29)


### Bug Fixes

* cannot save custom mailing, dropoff, or pickup address ([#2207](https://github.com/bloom-housing/bloom/issues/2207)) ([96484b5](https://github.com/bloom-housing/bloom/commit/96484b5676ecb000e492851ee12766ba9e6cd86f))





## [3.0.1-alpha.23](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.22...@bloom-housing/backend-core@3.0.1-alpha.23) (2021-11-23)


### Features

* updates email confirmation for lottery ([#2200](https://github.com/bloom-housing/bloom/issues/2200)) ([1a5e824](https://github.com/bloom-housing/bloom/commit/1a5e824c96d8e23674c32ea92688b9f7255528d3))





## [3.0.1-alpha.22](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.21...@bloom-housing/backend-core@3.0.1-alpha.22) (2021-11-23)


### Features

* new demographics sub-race questions ([#2109](https://github.com/bloom-housing/bloom/issues/2109)) ([9ab8926](https://github.com/bloom-housing/bloom/commit/9ab892694c1ad2fa8890b411b3b32af68ade1fc3))





## [3.0.1-alpha.21](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.20...@bloom-housing/backend-core@3.0.1-alpha.21) (2021-11-22)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.20](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.19...@bloom-housing/backend-core@3.0.1-alpha.20) (2021-11-22)


### Features

* adds jurisdictions to pref seeds ([#2199](https://github.com/bloom-housing/bloom/issues/2199)) ([9e47cec](https://github.com/bloom-housing/bloom/commit/9e47cec3b1acfe769207ccbb33c07019cd742e33))





## [3.0.1-alpha.19](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.18...@bloom-housing/backend-core@3.0.1-alpha.19) (2021-11-22)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.18](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.17...@bloom-housing/backend-core@3.0.1-alpha.18) (2021-11-22)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.17](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.16...@bloom-housing/backend-core@3.0.1-alpha.17) (2021-11-17)


### Bug Fixes

* **backend:** fix view.spec.ts test ([#2175](https://github.com/bloom-housing/bloom/issues/2175)) ([324446c](https://github.com/bloom-housing/bloom/commit/324446c90138d8fac50aba445f515009b5a58bfb))





## [3.0.1-alpha.16](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.15...@bloom-housing/backend-core@3.0.1-alpha.16) (2021-11-16)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.15](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.14...@bloom-housing/backend-core@3.0.1-alpha.15) (2021-11-15)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.14](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.13...@bloom-housing/backend-core@3.0.1-alpha.14) (2021-11-15)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.13](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.12...@bloom-housing/backend-core@3.0.1-alpha.13) (2021-11-15)


### Reverts

* Revert "feat(backend): add nginx proxy-cache configuration (#2119)" ([d7a8951](https://github.com/bloom-housing/bloom/commit/d7a8951bc6686d4361f7c1100f09a45b29058fd0)), closes [#2119](https://github.com/bloom-housing/bloom/issues/2119)





## [3.0.1-alpha.12](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.11...@bloom-housing/backend-core@3.0.1-alpha.12) (2021-11-12)


### Bug Fixes

* sapp submission w/ no due date ([4af1f5a](https://github.com/bloom-housing/bloom/commit/4af1f5a8448f16d347b4a65ecb85fda4d6ed71fc))





## [3.0.1-alpha.11](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.10...@bloom-housing/backend-core@3.0.1-alpha.11) (2021-11-12)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.10](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.9...@bloom-housing/backend-core@3.0.1-alpha.10) (2021-11-11)


### Bug Fixes

* recalculate units available on listing update ([#2150](https://github.com/bloom-housing/bloom/issues/2150)) ([f1a3dbc](https://github.com/bloom-housing/bloom/commit/f1a3dbce6478b16542ed61ab20de5dfb9b797262))





## [3.0.1-alpha.9](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.8...@bloom-housing/backend-core@3.0.1-alpha.9) (2021-11-10)


### Features

* **backend:** add nginx proxy-cache configuration ([#2119](https://github.com/bloom-housing/bloom/issues/2119)) ([34d32e7](https://github.com/bloom-housing/bloom/commit/34d32e75ceae378a26c57f4c9b7feec8c88339e0))





## [3.0.1-alpha.8](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.7...@bloom-housing/backend-core@3.0.1-alpha.8) (2021-11-09)


### Bug Fixes

* updates address order ([#2151](https://github.com/bloom-housing/bloom/issues/2151)) ([252e014](https://github.com/bloom-housing/bloom/commit/252e014dcbd2e4c305384ed552135f5a8e4e4767))





## [3.0.1-alpha.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.6...@bloom-housing/backend-core@3.0.1-alpha.7) (2021-11-09)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.5...@bloom-housing/backend-core@3.0.1-alpha.6) (2021-11-09)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.5](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.4...@bloom-housing/backend-core@3.0.1-alpha.5) (2021-11-09)


### Features

* **backend:** improve application flagged set saving efficiency ([#2147](https://github.com/bloom-housing/bloom/issues/2147)) ([08a064c](https://github.com/bloom-housing/bloom/commit/08a064c319adabb5385e474f5751246d92dba9a2))





## [3.0.1-alpha.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.3...@bloom-housing/backend-core@3.0.1-alpha.4) (2021-11-09)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.2...@bloom-housing/backend-core@3.0.1-alpha.3) (2021-11-08)


### Features

* add Programs section to listings management ([#2093](https://github.com/bloom-housing/bloom/issues/2093)) ([9bd1fe1](https://github.com/bloom-housing/bloom/commit/9bd1fe1033dee0fb7e73756254474471bc304f5e))





## [3.0.1-alpha.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.1...@bloom-housing/backend-core@3.0.1-alpha.2) (2021-11-08)

**Note:** Version bump only for package @bloom-housing/backend-core





## [3.0.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.0...@bloom-housing/backend-core@3.0.1-alpha.1) (2021-11-08)


### Features

* **backend:** extend UserUpdateDto to support email change with confirmation ([#2120](https://github.com/bloom-housing/bloom/issues/2120)) ([3e1fdbd](https://github.com/bloom-housing/bloom/commit/3e1fdbd0ea91d4773973d5c485a5ba61303db90a))





## [3.0.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.0...@bloom-housing/backend-core@3.0.1-alpha.0) (2021-11-05)


* 1837/preferences cleanup 3 (#2144) ([3ce6d5e](https://github.com/bloom-housing/bloom/commit/3ce6d5eb5aac49431ec5bf4912dbfcbe9077d84e)), closes [#2144](https://github.com/bloom-housing/bloom/issues/2144)


### BREAKING CHANGES

* Preferences are now M-N relation with a listing and have an intermediate table with ordinal number

* refactor(backend): preferences deduplication

So far each listing referenced it's own unique Preferences. This change introduces Many to Many
relationship between Preference and Listing entity and forces sharing Preferences between listings.

* feat(backend): extend preferences migration with moving existing relations to a new intermediate tab

* feat(backend): add Preference - Jurisdiction ManyToMany relation

* feat: adapt frontend to backend changes

* fix(backend): typeORM preferences select statement

* fix(backend): connect preferences with jurisdictions in seeds, fix pref filter validator

* fix(backend): fix missing import in preferences-filter-params.ts

* refactor: rebase issue

* feat: uptake jurisdictional preferences

* fix: fixup tests

* fix: application preferences ignore page, always separate

* Remove page from src/migration/1633359409242-add-listing-preferences-intermediate-relation.ts

* fix: preference fetching and ordering/pages

* Fix code style issues with Prettier

* fix(backend): query User__leasingAgentInListings__jurisdiction_User__leasingAgentIn specified more

* fix: perferences cypress tests

Co-authored-by: Michal Plebanski <michalp@airnauts.com>
Co-authored-by: Emily Jablonski <emily.jablonski@exygy.com>
Co-authored-by: Lint Action <lint-action@samuelmeuli.com>





# [3.0.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.7...@bloom-housing/backend-core@3.0.0) (2021-11-05)

**Note:** Version bump only for package @bloom-housing/backend-core





## [2.0.1-alpha.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.6...@bloom-housing/backend-core@2.0.1-alpha.7) (2021-11-05)

**Note:** Version bump only for package @bloom-housing/backend-core





## [2.0.1-alpha.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.5...@bloom-housing/backend-core@2.0.1-alpha.6) (2021-11-04)


### Reverts

* Revert "refactor: listing preferences and adds jurisdictional filtering" ([41f72c0](https://github.com/bloom-housing/bloom/commit/41f72c0db49cf94d7930f5cfc88f6ee9d6040986))





## [2.0.1-alpha.5](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.4...@bloom-housing/backend-core@2.0.1-alpha.5) (2021-11-04)


### Bug Fixes

* **backend:** make it possible to filter portal users in /users endpoint ([#2078](https://github.com/bloom-housing/bloom/issues/2078)) ([29bf714](https://github.com/bloom-housing/bloom/commit/29bf714d28755916ec8ec896366c8c32c3a227c4))





## [2.0.1-alpha.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.3...@bloom-housing/backend-core@2.0.1-alpha.4) (2021-11-04)


### Features

* Updates application confirmation numbers ([#2072](https://github.com/bloom-housing/bloom/issues/2072)) ([75cd67b](https://github.com/bloom-housing/bloom/commit/75cd67bcb62280936bdeeaee8c9b7b2583a1339d))





## [2.0.1-alpha.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.2...@bloom-housing/backend-core@2.0.1-alpha.3) (2021-11-03)

**Note:** Version bump only for package @bloom-housing/backend-core





## [2.0.1-alpha.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.1...@bloom-housing/backend-core@2.0.1-alpha.2) (2021-11-03)


### Bug Fixes

* don't send email confirmation on paper app submission ([#2110](https://github.com/bloom-housing/bloom/issues/2110)) ([7f83b70](https://github.com/bloom-housing/bloom/commit/7f83b70327049245ecfba04ae3aea4e967929b2a))





## [2.0.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.0...@bloom-housing/backend-core@2.0.1-alpha.1) (2021-11-03)


### Features

* jurisdictional email signatures ([#2111](https://github.com/bloom-housing/bloom/issues/2111)) ([7a146ff](https://github.com/bloom-housing/bloom/commit/7a146ffb5de88cfa2950e2a469a99e38d71b33c8))





## [2.0.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0...@bloom-housing/backend-core@2.0.1-alpha.0) (2021-11-02)


### Features

* two new common app questions - Household Changes and Household Student ([#2070](https://github.com/bloom-housing/bloom/issues/2070)) ([42a752e](https://github.com/bloom-housing/bloom/commit/42a752ec073c0f5b65374c7a68da1e34b0b1c949))





# [2.0.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.16...@bloom-housing/backend-core@2.0.0) (2021-11-02)

**Note:** Version bump only for package @bloom-housing/backend-core





# [2.0.0-pre-tailwind.16](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.15...@bloom-housing/backend-core@2.0.0-pre-tailwind.16) (2021-11-02)


### Code Refactoring

* listing preferences and adds jurisdictional filtering ([9f661b4](https://github.com/bloom-housing/bloom/commit/9f661b43921ec939bd1bf5709c934ad6f56dd859))


### BREAKING CHANGES

* updates preference relationship with listings





# [2.0.0-pre-tailwind.15](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.14...@bloom-housing/backend-core@2.0.0-pre-tailwind.15) (2021-11-01)


### Bug Fixes

* reverts preferences to re-add as breaking/major bump ([508078e](https://github.com/bloom-housing/bloom/commit/508078e16649e4d5f669273c50ef62407aab995f))
* reverts preferences to re-add as breaking/major bump ([4f7d893](https://github.com/bloom-housing/bloom/commit/4f7d89327361b3b28b368c23cfd24e6e8123a0a8))





# [2.0.0-pre-tailwind.14](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.13...@bloom-housing/backend-core@2.0.0-pre-tailwind.14) (2021-10-30)


### Bug Fixes

* updates household member count ([#2112](https://github.com/bloom-housing/bloom/issues/2112)) ([3dee0f7](https://github.com/bloom-housing/bloom/commit/3dee0f7d676ff42d546ecf83a17659cd69d7e1bc))





# [2.0.0-pre-tailwind.13](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.12...@bloom-housing/backend-core@2.0.0-pre-tailwind.13) (2021-10-30)


* Preferences cleanup (#1947) ([7329a58](https://github.com/bloom-housing/bloom/commit/7329a58cc9242faf647459e46de1e3cff3fe9c9d)), closes [#1947](https://github.com/bloom-housing/bloom/issues/1947)


### BREAKING CHANGES

* Preferences are now M-N relation with a listing and have an intermediate table with ordinal number

* refactor(backend): preferences deduplication

So far each listing referenced it's own unique Preferences. This change introduces Many to Many
relationship between Preference and Listing entity and forces sharing Preferences between listings.

* feat(backend): extend preferences migration with moving existing relations to a new intermediate tab

* feat(backend): add Preference - Jurisdiction ManyToMany relation

* feat: adapt frontend to backend changes

* fix(backend): typeORM preferences select statement

* fix(backend): connect preferences with jurisdictions in seeds, fix pref filter validator

* fix(backend): fix missing import in preferences-filter-params.ts

* refactor: rebase issue

* feat: uptake jurisdictional preferences

* fix: fixup tests

* fix: application preferences ignore page, always separate

* Remove page from src/migration/1633359409242-add-listing-preferences-intermediate-relation.ts

* fix: preference fetching and ordering/pages

* Fix code style issues with Prettier

* fix(backend): query User__leasingAgentInListings__jurisdiction_User__leasingAgentIn specified more

* fix: perferences cypress tests

Co-authored-by: Emily Jablonski <emily.jablonski@exygy.com>
Co-authored-by: Sean Albert <smabert@gmail.com>
Co-authored-by: Lint Action <lint-action@samuelmeuli.com>





# [2.0.0-pre-tailwind.12](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.11...@bloom-housing/backend-core@2.0.0-pre-tailwind.12) (2021-10-29)


### Bug Fixes

* fix for csv demographics and preference patch ([4768fb0](https://github.com/bloom-housing/bloom/commit/4768fb00be55957b3b1b197d149187c79374b48d))





# [2.0.0-pre-tailwind.11](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.10...@bloom-housing/backend-core@2.0.0-pre-tailwind.11) (2021-10-28)


### Bug Fixes

* in listings management keep empty strings, remove empty objects ([#2064](https://github.com/bloom-housing/bloom/issues/2064)) ([c4b1e83](https://github.com/bloom-housing/bloom/commit/c4b1e833ec128f457015ac7ffa421ee6047083d9))





# [2.0.0-pre-tailwind.10](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.9...@bloom-housing/backend-core@2.0.0-pre-tailwind.10) (2021-10-27)

**Note:** Version bump only for package @bloom-housing/backend-core





# [2.0.0-pre-tailwind.9](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.8...@bloom-housing/backend-core@2.0.0-pre-tailwind.9) (2021-10-26)


### Bug Fixes

* Incorrect listing status ([#2015](https://github.com/bloom-housing/bloom/issues/2015)) ([48aa14e](https://github.com/bloom-housing/bloom/commit/48aa14eb522cb8e4d0a25fdeadcc392b30d7f1a9))





# [2.0.0-pre-tailwind.8](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.7...@bloom-housing/backend-core@2.0.0-pre-tailwind.8) (2021-10-22)


### Bug Fixes

* alternate contact email now validated ([#2035](https://github.com/bloom-housing/bloom/issues/2035)) ([b411695](https://github.com/bloom-housing/bloom/commit/b411695350f8f8de39c6994f2fac2fcb4678f678))





# [2.0.0-pre-tailwind.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.6...@bloom-housing/backend-core@2.0.0-pre-tailwind.7) (2021-10-22)


### Bug Fixes

* makes listing programs optional ([fbe7134](https://github.com/bloom-housing/bloom/commit/fbe7134348e59e3fdb86663cfdca7648655e7b4b))





# [2.0.0-pre-tailwind.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.5...@bloom-housing/backend-core@2.0.0-pre-tailwind.6) (2021-10-22)


### Features

* **backend:** add Program entity ([#1968](https://github.com/bloom-housing/bloom/issues/1968)) ([492ec4d](https://github.com/bloom-housing/bloom/commit/492ec4d333cf9b73af772a1aceed29813f405ba0)), closes [#2034](https://github.com/bloom-housing/bloom/issues/2034)





# [2.0.0-pre-tailwind.5](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.4...@bloom-housing/backend-core@2.0.0-pre-tailwind.5) (2021-10-22)

**Note:** Version bump only for package @bloom-housing/backend-core





# [2.0.0-pre-tailwind.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.3...@bloom-housing/backend-core@2.0.0-pre-tailwind.4) (2021-10-22)

**Note:** Version bump only for package @bloom-housing/backend-core





# [2.0.0-pre-tailwind.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.2...@bloom-housing/backend-core@2.0.0-pre-tailwind.3) (2021-10-21)

**Note:** Version bump only for package @bloom-housing/backend-core





# [2.0.0-pre-tailwind.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.1...@bloom-housing/backend-core@2.0.0-pre-tailwind.2) (2021-10-21)


### Bug Fixes

* **backend:** enforces lower casing of emails ([#1972](https://github.com/bloom-housing/bloom/issues/1972)) ([2608e82](https://github.com/bloom-housing/bloom/commit/2608e8228830a2fc7e6b522c73cb587adbb5803b))
* migration fix ([#2043](https://github.com/bloom-housing/bloom/issues/2043)) ([ffa4d45](https://github.com/bloom-housing/bloom/commit/ffa4d45e0f53ce071fc4dcf8079c06cf5e836ed3))


### Features

* adds jurisdiction filtering to listings ([#2027](https://github.com/bloom-housing/bloom/issues/2027)) ([219696b](https://github.com/bloom-housing/bloom/commit/219696ba784cfc079dd5aec74b24c3a8479160b6))
* **backend:** add languages (Language[]) to Jurisdiction entity ([#1998](https://github.com/bloom-housing/bloom/issues/1998)) ([9ceed24](https://github.com/bloom-housing/bloom/commit/9ceed24d48b14888e6ea59b421b409f875d12b01))
* **backend:** Add user delete endpoint and expose leasingAgentInList… ([#1996](https://github.com/bloom-housing/bloom/issues/1996)) ([a13f735](https://github.com/bloom-housing/bloom/commit/a13f73574b470beff2f8948abb226a6786856480))
* **backend:** make use of new application confirmation codes ([#2014](https://github.com/bloom-housing/bloom/issues/2014)) ([3c45c29](https://github.com/bloom-housing/bloom/commit/3c45c2904818200eed4568931d4cc352fd2f449e))
* **backend:** try fixing SETEX redis e2e tests flakiness ([#2044](https://github.com/bloom-housing/bloom/issues/2044)) ([4087c53](https://github.com/bloom-housing/bloom/commit/4087c532ddba672a415a048f4362e509aba7fd7f))





# [2.0.0-pre-tailwind.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.0...@bloom-housing/backend-core@2.0.0-pre-tailwind.1) (2021-10-19)

**Note:** Version bump only for package @bloom-housing/backend-core

# 2.0.0-pre-tailwind.0 (2021-10-19)

### Bug Fixes

- **backend:** Change tokenMissing to account already confirmed error … ([#1971](https://github.com/bloom-housing/bloom/issues/1971)) ([bc6ec92](https://github.com/bloom-housing/bloom/commit/bc6ec9243fb5be62ca8e240d96b828d418a9ee5b))
- **backend:** totalFlagged from AFS missing in swagger documentation ([#1997](https://github.com/bloom-housing/bloom/issues/1997)) ([0abf5dd](https://github.com/bloom-housing/bloom/commit/0abf5ddefe8d4f33a895fe3faf59d43316f56003))
- **backend:** unitCreate and UnitUpdateDto now require only IdDto for… ([#1956](https://github.com/bloom-housing/bloom/issues/1956)) ([43dcfbe](https://github.com/bloom-housing/bloom/commit/43dcfbe7493bdd654d7b898ed9650804a016065c)), closes [#1897](https://github.com/bloom-housing/bloom/issues/1897)
- Fix dev seeds with new priority types ([#1920](https://github.com/bloom-housing/bloom/issues/1920)) ([b01bd7c](https://github.com/bloom-housing/bloom/commit/b01bd7ca2c1ba3ba7948ad8213a0939375003d90))
- Fix maps unit max occupancy to household size ([d1fefcf](https://github.com/bloom-housing/bloom/commit/d1fefcf2ea20cccf90375881c2a19d51bf986678))
- Fixes reserved community type import ([e5b0e25](https://github.com/bloom-housing/bloom/commit/e5b0e25f556af6cdcdf05d79825736dddcd1e105))
- Fixes unit types for max income ([87f018a](https://github.com/bloom-housing/bloom/commit/87f018a410657037a7c9a74a93ec6dbac6b42dec))
- Fixes unit types for max income ([#2013](https://github.com/bloom-housing/bloom/issues/2013)) ([b8966a1](https://github.com/bloom-housing/bloom/commit/b8966a19ea79012456f7f28d01c34b32d6f207bb))
- Multiple ami charts should show a max not a range ([#1925](https://github.com/bloom-housing/bloom/issues/1925)) ([142f436](https://github.com/bloom-housing/bloom/commit/142f43697bff23d2f59c7897d51ced83a2003308))
- Plus one to maxHouseholdSize for bmr ([401c956](https://github.com/bloom-housing/bloom/commit/401c956b0e885d3485b427622b82b85fd9a5f8b1))
- Removes 150 char limit on textarea fields ([6eb7036](https://github.com/bloom-housing/bloom/commit/6eb70364409c5910aa9b8277b37a8214c2a94358))
- Removes nested validation from applicationAddress ([747fd83](https://github.com/bloom-housing/bloom/commit/747fd836a9b5b8333a6586727b00c5674ef87a86))
- Update alameda's notification sign up URL ([#1874](https://github.com/bloom-housing/bloom/issues/1874)) ([3eb85fc](https://github.com/bloom-housing/bloom/commit/3eb85fccf7521e32f3d1f369e706cec0c078b536))

### Features

- **backend:** Add jurisdiction relation to ami charts entity ([#1905](https://github.com/bloom-housing/bloom/issues/1905)) ([1f13985](https://github.com/bloom-housing/bloom/commit/1f13985142c7908b4c37eaf0fbbbad0ad660f014))
- **backend:** Add jurisidction relation to ReservedCommunittType Entity ([#1889](https://github.com/bloom-housing/bloom/issues/1889)) ([9b0fe73](https://github.com/bloom-housing/bloom/commit/9b0fe73fe9ed1349584e119f235cb66f6e68785f))
- Listings management draft and publish validation backend & frontend ([#1850](https://github.com/bloom-housing/bloom/issues/1850)) ([ef67997](https://github.com/bloom-housing/bloom/commit/ef67997a056c6f1f758d2fa67bf877d4a3d897ab))
- Support PDF uploads or webpage links for building selection criteria ([#1893](https://github.com/bloom-housing/bloom/issues/1893)) ([8514b43](https://github.com/bloom-housing/bloom/commit/8514b43ba337d33cb877ff468bf780ff47fdc772))

### Performance Improvements

- **applications and flagged sets:** Adds indexes and updates listWit… ([#2003](https://github.com/bloom-housing/bloom/issues/2003)) ([f9efb15](https://github.com/bloom-housing/bloom/commit/f9efb15b930865b517249d5dc525c11d68dc251d))

### Reverts

- Revert "latest dev (#1999)" ([73a2789](https://github.com/bloom-housing/bloom/commit/73a2789d8f133f2d788e2399faa42b374d74ab15)), closes [#1999](https://github.com/bloom-housing/bloom/issues/1999)
- **backend:** Revert some listing filters ([#1984](https://github.com/bloom-housing/bloom/issues/1984)) ([14847e1](https://github.com/bloom-housing/bloom/commit/14847e1a797930f3e30bd945a2617dec2e3d679f))

### BREAKING CHANGES

- POST/PUT /listings interface change
- Manually add totalFlagged until fixed
