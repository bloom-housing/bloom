# buildListingDetails Method - Unit Test Planning Analysis

## Method Overview

**File Location:** [api/src/services/email.service.ts](../api/src/services/email.service.ts#L971)

**Method Signature:**
```typescript
public async buildListingDetails(
    listing: Listing,
    priorityTypes: UnitAccessibilityPriorityTypeEnum[],
    listingUnitsSummary: ListingUnitsSummary,
): Promise<{ label: string; value: string | number }[]>
```

**Purpose:** Builds an array of listing detail objects with localized labels and values for display in listing opportunity emails. Returns structured data for rendering rental opportunity details with internationalization support.

---

## Parameter Types Analysis

### 1. Parameter: `listing` (Type: `Listing`)

**Import Source:** `../dtos/listings/listing.dto`

**Expected Properties Used:**
- `listing?.reservedCommunityTypes?.name` (optional, string) - Community type identifier for filtering
- `listing?.applicationDueDate` (optional, Date | string) - Application deadline date
- `listing.listingsBuildingAddress` (required) - Building address object
- `listing.neighborhood` (optional, string) - Neighborhood name/description
- `listing.reviewOrderType` (optional, `ReviewOrderTypeEnum`) - Review processing type
- `listing.listingEvents` (array) - List of listing events to filter for lottery information

**Property Access Patterns:**
- Safe optional chaining: `listing?.reservedCommunityTypes?.name`, `listing?.applicationDueDate`
- Direct property access: `listing.neighborhood`, `listing.reviewOrderType`, `listing.listingEvents`
- Nested destructuring: `listing.listingsBuildingAddress` passed to utility function

### 2. Parameter: `priorityTypes` (Type: `UnitAccessibilityPriorityTypeEnum[]`)

**Import Source:** `../enums/units/accessibility-priority-type-enum`

**Usage Pattern:**
- Array of enum values representing unit accessibility priority types
- Array length check determines section inclusion: `if (priorityTypes.length)`
- Each type is mapped through translation: `priorityTypes.map((type) => this.polyglot.t(...))`
- Values joined into comma-separated display string

**Translation Pattern:**
- Enum values map to translation keys: `rentalOpportunity.accessibilityType.{enumValue}`
- Example: `UnitAccessibilityPriorityTypeEnum.wheelchairRamp` → `rentalOpportunity.accessibilityType.wheelchairRamp`

### 3. Parameter: `listingUnitsSummary` (Type: `ListingUnitsSummary`)

**Import Source:** `../utilities/listing-data-formatters`

**Type Definition:**
```typescript
export type ListingUnitsSummary = {
  units: { [key: string]: UnitTypeSummary };
  flatRent: MinMax | undefined;
  percentageRent: MinMax | undefined;
  minIncome: MinMax | undefined;
  maxIncome: MinMax | undefined;
};

type MinMax = {
  min: number;
  max: number;
};

type UnitTypeSummary = {
  count: number;
  baths: MinMax | undefined;
  sqft: MinMax | undefined;
};
```

**Property Breakdown:**

#### `units` (Required)
- Type: `Record<string, UnitTypeSummary>`
- Object keyed by unit type identifiers (e.g., 'studio', 'oneBed', 'twoBed')
- Each unit type contains:
  - `count`: number - Total count of units of this type
  - `baths`: optional object with `{ min: number, max: number }` - Bathroom count range
  - `sqft`: optional object with `{ min: number, max: number }` - Square footage range

#### `flatRent` (Optional)
- Type: `MinMax | undefined`
- Object with `{ min: number, max: number }` when present
- Represents flat monthly rent amounts
- Used when units have fixed monthly rent

#### `percentageRent` (Optional)
- Type: `MinMax | undefined`
- Object with `{ min: number, max: number }` when present
- Represents percentage-of-income rent amounts
- Used when units have income-based rent

#### `minIncome` (Optional)
- Type: `MinMax | undefined`
- Object with `{ min: number, max: number }` when present
- Monthly income minimum required to qualify

#### `maxIncome` (Optional)
- Type: `MinMax | undefined`
- Object with `{ min: number, max: number }` when present
- Monthly income maximum allowed (AMI limits)

**Usage in Method:**
```typescript
// Accessing units
Object.keys(listingUnitsSummary.units).sort(...)  // Get unit type keys
const { count, baths, sqft } = listingUnitsSummary.units[key]  // Destructure unit details

// Conditional checks
if (listingUnitsSummary.flatRent || listingUnitsSummary.percentageRent) { ... }
if (listingUnitsSummary.minIncome) { ... }
if (listingUnitsSummary.maxIncome) { ... }
```

---

## Return Type Analysis

**Return Type:** `Promise<{ label: string; value: string | number }[]>`

**Array Element Structure:**
```typescript
{
  label: string,           // i18n translated label (from polyglot.t())
  value: string | number   // Formatted value (typically string, rarely number)
}
```

**Return Array Contents (Order of Addition):**

1. **Reserved Community Type** (Conditional)
   - Condition: `if (listing?.reservedCommunityTypes?.name)`
   - label: `rentalOpportunity.community`
   - value: translated community type name
   - Translation key: `rentalOpportunity.communityType.${listing.reservedCommunityTypes.name}`

2. **Application Due Date** (Conditional)
   - Condition: `if (listing?.applicationDueDate)`
   - label: `rentalOpportunity.applicationsDue`
   - value: formatted date using `formatLocalDate()` with format `'MMMM DD, YYYY'`
   - Example value: `"March 15, 2024"`

3. **Address** (Always Included)
   - label: `rentalOpportunity.address`
   - value: formatted address string from `oneLineAddress()` utility
   - Format: `"Street, Street2, City, State ZipCode"`
   - Example: `"123 Main St, Suite 100, San Francisco, CA 94102"`

4. **Neighborhood** (Conditional)
   - Condition: `if (listing.neighborhood)`
   - label: `rentalOpportunity.neighborhood`
   - value: neighborhood string (direct from listing object)

5. **Unit Types/Accessibility** (Conditional)
   - Condition: `if (priorityTypes.length)`
   - label: `rentalOpportunity.unitType`
   - value: comma-separated string of translated accessibility types
   - Example: `"Wheelchair Ramp, Elevator Access, Accessible Kitchen"`

6. **Opportunity Type** (Conditional - Lottery or Waitlist Only)
   - Condition: `if (listing.reviewOrderType && (lottery || waitlist))`
   - label: `rentalOpportunity.opportunityType`
   - value: translated review order type
   - Translation key: `rentalOpportunity.${listing.reviewOrderType}`
   - Note: Only included for `ReviewOrderTypeEnum.lottery` or `ReviewOrderTypeEnum.waitlist`

7. **Unit Summary Details** (Dynamic - Multiple Entries)
   - One entry per unit type in `listingUnitsSummary.units`
   - label: `rentalOpportunity.unitTypes.${unitTypeKey}`
   - value: formatted summary string with conditional parts
   - Format: `"{count} {bedrooms}, {bath range}, {sqft range}"`
   - Examples:
     - `"5 bedrooms, 2 baths, 1200 sqft"`
     - `"10 studios, 1 - 2 baths, 500 - 650 sqft"`

8. **Rent Information** (Conditional)
   - Condition: `if (listingUnitsSummary.flatRent || listingUnitsSummary.percentageRent)`
   - label: `rentalOpportunity.rent`
   - value: formatted rent string (one of three patterns)
   - Three patterns:
     - **Mixed** (both flatRent and percentageRent): `"% of income, or up to $X"`
     - **Flat Rent Only**: `"$X/month"` or `"$X - $Y/month"`
     - **Percentage Rent Only**: `"X% of income"` or `"X% - Y% of income"`

9. **Minimum Income** (Conditional)
   - Condition: `if (listingUnitsSummary.minIncome)`
   - label: `rentalOpportunity.minIncome`
   - value: formatted income string
   - Format: `"$X/month"` or `"$X - $Y/month"`

10. **Maximum Income** (Conditional)
    - Condition: `if (listingUnitsSummary.maxIncome)`
    - label: `rentalOpportunity.maxIncome`
    - value: formatted income string
    - Format: `"$X/month"` or `"$X - $Y/month"`

11. **Lottery Date** (Conditional)
    - Condition: `if (lotteryInfo.length)` where `lotteryInfo = listing.listingEvents.filter(e => e.type === ListingEventsTypeEnum.publicLottery)`
    - label: `rentalOpportunity.lotteryDate`
    - value: formatted date using `formatLocalDate()` with format `'MMMM DD, YYYY'`
    - Uses first lottery event's startDate: `lotteryInfo[0].startDate`

---

## Method Logic & Control Flow

### High-Level Algorithm:
1. Initialize empty `listingDetails` array
2. Conditionally add 6 optional/conditional sections (community, due date, neighborhood, accessibility, opportunity type, lottery date)
3. **Always add** address section (required)
4. Iterate through unit types and dynamically add unit summary sections
5. Conditionally add rent information (complex 3-branch logic)
6. Conditionally add income information (min/max, each independent)
7. Return assembled array

### Conditional Logic Patterns:

**Optional Property Checks with Safe Chaining:**
```typescript
if (listing?.reservedCommunityTypes?.name) { ... }      // Null-safe nested property
if (listing?.applicationDueDate) { ... }                // Null-safe property
if (listing.neighborhood) { ... }                       // Falsy check
if (priorityTypes.length) { ... }                       // Array length check
```

**Enum Type Matching:**
```typescript
if (
  listing.reviewOrderType &&
  (listing.reviewOrderType === ReviewOrderTypeEnum.lottery ||
   listing.reviewOrderType === ReviewOrderTypeEnum.waitlist)
) { ... }
```
Note: Only lottery and waitlist types trigger "Opportunity Type" section. Other types (firstComeFirstServe, waitlistLottery) are excluded.

**Unit Type Iteration with Sorting:**
```typescript
const unitRowOrder = Object.keys(listingUnitsSummary.units).sort(
  (a, b) => unitTypeMapping[a] - unitTypeMapping[b]
);
unitRowOrder.forEach((key) => { ... });  // Sorted iteration
```

**Complex Rent Logic (Three Mutually Exclusive Branches):**
```typescript
if (listingUnitsSummary.flatRent && listingUnitsSummary.percentageRent) {
  // Pattern 1: Mixed rent types
  rentSummaryValue = `% of income, or up to $${listingUnitsSummary.flatRent.max}`;
} else if (listingUnitsSummary.flatRent) {
  // Pattern 2: Flat rent only
  rentSummaryValue = flatRent.min === flatRent.max
    ? `$${flatRent.min}/month`
    : `$${flatRent.min} - $${flatRent.max}/month`;
} else {
  // Pattern 3: Percentage rent only
  rentSummaryValue = percentageRent.min === percentageRent.max
    ? `${percentageRent.min}% of income`
    : `${percentageRent.min}% - ${percentageRent.max}% of income`;
}
```

**Range vs Single Value Formatting:**
```typescript
// Pattern used for baths, sqft, income
value.min === value.max 
  ? value.max                          // Single value: just show max
  : `${value.min} - ${value.max}`      // Range: show min - max
```

**Unit Summary String Construction:**
```typescript
let summaryString = `${this.polyglot.t('rentalOpportunity.unitCount', {
  smart_count: count,
})}`;  // "5 bedrooms"

if (baths) {
  summaryString += `, ${/* bath formatting */}`;  // Add baths
}

if (sqft) {
  summaryString += `, ${/* sqft formatting */}`;  // Add sqft
}
```

---

## Dependencies & Mocked Requirements

### Instance Methods Used:

1. **`this.polyglot.t(key, options?)`**
   - Library: node-polyglot
   - Purpose: Translation function for i18n
   - Parameters: 
     - `key`: string - Translation key path
     - `options`: `number | Polyglot.InterpolationOptions` - Optional interpolation variables
   - Usage pattern: `this.polyglot.t('rentalOpportunity.community')`
   - With interpolation: `this.polyglot.t('rentalOpportunity.unitCount', { smart_count: count })`
   - Returns: Translated string

2. **`this.formatLocalDate(date, format)`**
   - Defined in: EmailService class (line 1202)
   - Purpose: Format dates using dayjs
   - Parameters:
     - `date`: string | Date - Date to format
     - `format`: string - dayjs format string (e.g., 'MMMM DD, YYYY')
   - Uses: dayjs with UTC, timezone, and advanced format plugins
   - Returns: Formatted date string
   - Example: `"March 15, 2024"`

### Utility Functions Used:

1. **`oneLineAddress(address: Address)`**
   - Import: `../utilities/listing-data-formatters`
   - Purpose: Convert address object to single-line string
   - Input: Address DTO with properties: `street`, `street2` (optional), `city`, `state`, `zipCode`
   - Format: `"${street}${street2}, ${city}, ${state} ${zipCode}"`
   - Returns: Formatted address string
   - Defensive: Returns empty string if address is falsy

2. **`unitTypeMapping`**
   - Import: `../../prisma/seed-helpers/unit-type-factory`
   - Purpose: Maps unit type keys to numeric sort order values
   - Usage: `unitTypeMapping[unitTypeKey]` to get sort value
   - Used in: `Object.keys(listingUnitsSummary.units).sort((a, b) => unitTypeMapping[a] - unitTypeMapping[b])`
   - Expected structure: `{ [unitTypeKey: string]: number }`
   - Example keys: 'studio', 'oneBed', 'twoBed', 'threeBed', etc.

### External Dependencies:
- **dayjs** - Date manipulation library with plugins:
  - utc: UTC timezone support
  - tz: Timezone support
  - advancedFormat: Custom formatting options
- **node-polyglot** - i18n translation library
- **@prisma/client** - Enum types:
  - `ReviewOrderTypeEnum` (lottery, waitlist, firstComeFirstServe, waitlistLottery)
  - `ListingEventsTypeEnum` (publicLottery, etc.)
- **UnitAccessibilityPriorityTypeEnum** - Custom enum for accessibility types

---

## Edge Cases & Boundary Conditions

### 1. **Undefined/Null Properties**
- `listing?.reservedCommunityTypes?.name` - Safe chaining handles intermediate nulls
- `listing?.applicationDueDate` - Safe chaining prevents errors
- Risk: If polyglot translation returns empty string, section still added but with empty value

### 2. **Empty Arrays**
- `priorityTypes.length === 0` - Section skipped entirely
- `listingUnitsSummary.units === {}` - No unit summaries added
- `listing.listingEvents.filter(...).length === 0` - Lottery date section skipped

### 3. **Undefined Optional Properties in listingUnitsSummary**
- `flatRent === undefined && percentageRent === undefined` - Rent section skipped
- `minIncome === undefined` - Min income section skipped
- `maxIncome === undefined` - Max income section skipped
- Each property independently checked before use

### 4. **Missing Unit Type Keys**
- `unitTypeMapping[unitTypeKey]` could be undefined
- If unit type key missing from mapping, sort comparison produces `NaN`
- Could result in unstable sort order
- **Risk:** Unit types not in mapping sort unpredictably

### 5. **Missing Nested Structure Properties**
- Destructuring `const { count, baths, sqft } = listingUnitsSummary.units[key]` assumes structure
- If key exists but missing properties, destructuring returns `undefined` for missing properties
- Handling: Conditional checks before using (`if (baths)`, `if (sqft)`)
- **Risk:** No defensive check for `listingUnitsSummary.units` existence itself

### 6. **Range Value Edge Cases**
- Min === Max comparison for single value formatting
- Both patterns correctly handle equality: `flatRent.min === flatRent.max ? single : range`
- **Risk:** If min > max (invalid data), range would display backwards (e.g., "$5000 - $3000")

### 7. **Dynamic Translation Key Construction**
- `rentalOpportunity.communityType.${listing.reservedCommunityTypes.name}`
- `rentalOpportunity.accessibilityType.${type}`
- `rentalOpportunity.unitTypes.${unitTypeKey}`
- `rentalOpportunity.${listing.reviewOrderType}`
- **Risk:** If translation key doesn't exist in polyglot, returns key itself as string

### 8. **Date Formatting Errors**
- `formatLocalDate()` with invalid date input could throw
- If `lotteryInfo[0].startDate` is invalid date string, formatting fails
- **Risk:** No try-catch in method; error propagates up

### 9. **Address Utility Defensive Handling**
- `oneLineAddress()` returns empty string if address falsy
- But method doesn't check for empty return
- Could result in empty value for required address field

### 10. **Review Order Type Value**
- Only two types trigger opportunity type section
- Other types silently skipped (not an error, but important logic)
- Correctly filters for lottery and waitlist only

### 11. **Income Range String Formatting**
- Similar to rent logic with min === max checks
- Wraps entire formatted string in backticks: `` `$...` ``
- **Risk:** Extra backticks if there's template string interpolation error

---

## Unit Test Planning Recommendations

### Test Categories:

#### 1. **Conditional Inclusion Tests** (8-10 tests)
- ✓ Reserved community type added when name exists
- ✓ Reserved community type skipped when name undefined
- ✓ Application due date added when exists
- ✓ Application due date skipped when undefined
- ✓ Neighborhood added when non-empty
- ✓ Neighborhood skipped when undefined/null
- ✓ Unit types added when priorityTypes has items
- ✓ Unit types skipped when priorityTypes empty array
- ✓ Opportunity type added for lottery review order
- ✓ Opportunity type added for waitlist review order
- ✓ Opportunity type skipped for other review order types
- ✓ Lottery date added when public lottery events exist
- ✓ Lottery date skipped when no lottery events

#### 2. **Data Formatting Tests** (10-12 tests)
- ✓ Date formatting via `formatLocalDate()` mock verification
- ✓ Address formatting via `oneLineAddress()` mock verification
- ✓ Rent range formatting (single value: min === max)
- ✓ Rent range formatting (range: min !== max)
- ✓ Mixed rent type formatting (flat + percentage)
- ✓ Flat rent only formatting
- ✓ Percentage rent only formatting
- ✓ Income range formatting (single value)
- ✓ Income range formatting (range)
- ✓ Priority types comma-separated string
- ✓ Unit summary string with all components (count, baths, sqft)
- ✓ Unit summary string with partial components

#### 3. **Array Structure & Return Type Tests** (5-7 tests)
- ✓ Return type is Promise resolving to array
- ✓ Each array element has label and value properties
- ✓ Label values are strings (translation keys)
- ✓ Value types are string or number
- ✓ Array maintains insertion order
- ✓ Correct number of items for given input
- ✓ Address is always present (minimum 1 item even with minimal data)

#### 4. **Edge Case Tests** (8-10 tests)
- ✓ Empty `priorityTypes` array
- ✓ Empty `listingUnitsSummary.units` object
- ✓ No lottery events in `listing.listingEvents`
- ✓ Null/undefined nested properties don't cause errors
- ✓ Min === Max in rent fields (flatRent, percentageRent)
- ✓ Min === Max in income fields (minIncome, maxIncome)
- ✓ Min === Max in unit details (baths, sqft)
- ✓ All optional properties undefined (only address included)
- ✓ Invalid date strings handled gracefully
- ✓ Missing address throws or handles gracefully

#### 5. **Rent Logic Tests** (4-5 tests)
- ✓ Both flatRent and percentageRent present (mixed pattern)
- ✓ Only flatRent present (flat pattern)
- ✓ Only percentageRent present (percentage pattern)
- ✓ Flat rent single value formatting
- ✓ Flat rent range formatting

#### 6. **Income Logic Tests** (4 tests)
- ✓ MinIncome present vs absent
- ✓ MaxIncome present vs absent
- ✓ Single income value (min === max)
- ✓ Income range (min !== max)

#### 7. **Opportunity Type Tests** (4 tests)
- ✓ ReviewOrderType === ReviewOrderTypeEnum.lottery
- ✓ ReviewOrderType === ReviewOrderTypeEnum.waitlist
- ✓ ReviewOrderType === ReviewOrderTypeEnum.firstComeFirstServe (excluded)
- ✓ ReviewOrderType === ReviewOrderTypeEnum.waitlistLottery (excluded)

#### 8. **Unit Type Sorting Tests** (4-5 tests)
- ✓ Units sorted by unitTypeMapping order
- ✓ Correct unit type labels used (translation keys)
- ✓ Correct unit count values
- ✓ Bathroom range formatting in unit summary
- ✓ Square footage range formatting in unit summary

#### 9. **Translation Integration Tests** (5-6 tests)
- ✓ Correct translation keys requested
- ✓ Translation key interpolation for smart_count
- ✓ Translation key interpolation for community type name
- ✓ Translation key interpolation for accessibility type
- ✓ Translation key interpolation for review order type
- ✓ All polyglot.t() calls receive correct parameters

#### 10. **Full Integration Tests** (3-5 tests)
- ✓ Complete listing with all properties - verify all sections present
- ✓ Minimal listing (only required fields) - verify only address present
- ✓ Mixed data - verify correct conditional sections
- ✓ Real data from database - end-to-end test
- ✓ Verify output structure matches email template expectations

### Mock Setup Template:

```typescript
describe('buildListingDetails', () => {
  let service: EmailService;
  let mockPolyglot: any;

  beforeEach(() => {
    // Mock Polyglot
    mockPolyglot = {
      t: jest.fn((key: string, options?: any) => {
        return `Translated: ${key}`;
      }),
    };

    // Mock EmailService and inject mock polyglot
    service = new EmailService(
      /* emailProvider */,
      /* translationService */,
      /* jurisdictionService */,
      /* logger */
    );
    service.polyglot = mockPolyglot;

    // Mock formatLocalDate
    jest.spyOn(service, 'formatLocalDate').mockReturnValue('March 15, 2024');

    // Mock oneLineAddress utility
    jest.mock('../utilities/listing-data-formatters', () => ({
      oneLineAddress: jest.fn(() => '123 Main St, San Francisco, CA 94102'),
    }));

    // Mock unitTypeMapping
    jest.mock('../../prisma/seed-helpers/unit-type-factory', () => ({
      unitTypeMapping: {
        'studio': 0,
        'oneBed': 1,
        'twoBed': 2,
        'threeBed': 3,
      },
    }));
  });

  // Test cases here...
});
```

### Sample Test Case Examples:

```typescript
// Test 1: Basic Happy Path - All properties present
it('should include all detail sections when all properties present', async () => {
  const listing = {
    reservedCommunityTypes: { name: 'general' },
    applicationDueDate: '2024-03-15',
    listingsBuildingAddress: { street: '123 Main', street2: '', city: 'SF', state: 'CA', zipCode: '94102' },
    neighborhood: 'Downtown',
    reviewOrderType: ReviewOrderTypeEnum.lottery,
    listingEvents: [{ type: ListingEventsTypeEnum.publicLottery, startDate: '2024-03-20' }],
  };
  const priorityTypes = [UnitAccessibilityPriorityTypeEnum.wheelchairRamp];
  const summary: ListingUnitsSummary = {
    units: { 'oneBed': { count: 5, baths: { min: 1, max: 1 }, sqft: { min: 600, max: 700 } } },
    flatRent: { min: 1500, max: 2000 },
    percentageRent: undefined,
    minIncome: { min: 45000, max: 45000 },
    maxIncome: { min: 120000, max: 120000 },
  };

  const result = await service.buildListingDetails(listing, priorityTypes, summary);

  expect(result.length).toBe(11); // All sections
  expect(result[0].label).toBe('rentalOpportunity.community'); // Community type
  expect(result[2].label).toBe('rentalOpportunity.address'); // Address (always index 2)
});

// Test 2: Minimal Data - Only required field
it('should include only address when minimal data provided', async () => {
  const listing = {
    listingsBuildingAddress: { street: '123 Main', street2: '', city: 'SF', state: 'CA', zipCode: '94102' },
    listingEvents: [],
  };
  const priorityTypes: UnitAccessibilityPriorityTypeEnum[] = [];
  const summary: ListingUnitsSummary = {
    units: {},
    flatRent: undefined,
    percentageRent: undefined,
    minIncome: undefined,
    maxIncome: undefined,
  };

  const result = await service.buildListingDetails(listing, priorityTypes, summary);

  expect(result.length).toBe(1); // Only address
  expect(result[0].label).toBe('rentalOpportunity.address');
});

// Test 3: Mixed Rent Types
it('should format mixed rent types correctly', async () => {
  const summary: ListingUnitsSummary = {
    units: {},
    flatRent: { min: 1500, max: 2000 },
    percentageRent: { min: 25, max: 30 },
    minIncome: undefined,
    maxIncome: undefined,
  };

  const result = await service.buildListingDetails(
    { listingEvents: [] },
    [],
    summary
  );

  const rentItem = result.find(item => item.label === 'rentalOpportunity.rent');
  expect(rentItem?.value).toContain('% of income');
  expect(rentItem?.value).toContain('up to $2000');
});

// Test 4: Unit Sorting
it('should sort units by unitTypeMapping order', async () => {
  const summary: ListingUnitsSummary = {
    units: {
      'threeBed': { count: 2, baths: undefined, sqft: undefined },
      'studio': { count: 5, baths: undefined, sqft: undefined },
      'twoBed': { count: 3, baths: undefined, sqft: undefined },
    },
    flatRent: undefined,
    percentageRent: undefined,
    minIncome: undefined,
    maxIncome: undefined,
  };

  const result = await service.buildListingDetails(
    { listingEvents: [] },
    [],
    summary
  );

  // Units should be sorted: studio (0), twoBed (2), threeBed (3)
  const unitLabels = result
    .filter(item => item.label?.includes('rentalOpportunity.unitTypes'))
    .map(item => item.label);
  
  expect(unitLabels).toEqual([
    'rentalOpportunity.unitTypes.studio',
    'rentalOpportunity.unitTypes.twoBed',
    'rentalOpportunity.unitTypes.threeBed',
  ]);
});

// Test 5: Translation Calls Verification
it('should call polyglot.t with correct keys and interpolation', async () => {
  const listing = {
    listingsBuildingAddress: { street: '123 Main', city: 'SF', state: 'CA', zipCode: '94102' },
    listingEvents: [],
  };
  const summary: ListingUnitsSummary = {
    units: { 'oneBed': { count: 5, baths: { min: 1, max: 1 }, sqft: undefined } },
    flatRent: undefined,
    percentageRent: undefined,
    minIncome: undefined,
    maxIncome: undefined,
  };

  await service.buildListingDetails(listing, [], summary);

  // Verify polyglot calls
  expect(mockPolyglot.t).toHaveBeenCalledWith('rentalOpportunity.address');
  expect(mockPolyglot.t).toHaveBeenCalledWith('rentalOpportunity.unitCount', { smart_count: 5 });
  expect(mockPolyglot.t).toHaveBeenCalledWith('rentalOpportunity.bathCount', { smart_count: 1 });
});
```

---

## Type Safety Assessment

### Current Implementation Status:
✅ **IMPROVED** - The parameter is now properly typed as `ListingUnitsSummary` instead of `any`

### Type Definition Quality:
```typescript
export type ListingUnitsSummary = {
  units: { [key: string]: UnitTypeSummary };
  flatRent: MinMax | undefined;
  percentageRent: MinMax | undefined;
  minIncome: MinMax | undefined;
  maxIncome: MinMax | undefined;
};
```

**Strengths:**
- ✅ Clear nested type structure
- ✅ Optional properties explicitly typed as `| undefined`
- ✅ Range values properly typed with MinMax interface
- ✅ Reusable MinMax and UnitTypeSummary types

**Remaining Type Safety Considerations:**
1. **`listingUnitsSummary.units` could be empty** - No required guarantee, but method handles it
2. **Unit type keys not constrained** - Any string accepted as key; no enum validation
3. **Missing defensive check** - No null check for `listingUnitsSummary.units` before accessing
4. **unitTypeMapping type unknown** - Should be typed in codebase
5. **Listing type not fully visible** - Some properties potentially optional but not marked

### Recommended Additional Type Guards:

```typescript
// Validate listingUnitsSummary structure before processing
if (!listingUnitsSummary?.units) {
  throw new Error('listingUnitsSummary.units is required');
}

// Type guard for unitTypeMapping access
const sortValue = unitTypeMapping[key];
if (typeof sortValue !== 'number') {
  console.warn(`Unit type key '${key}' not found in unitTypeMapping`);
  // Handle gracefully or use default sort value
}
```

---

## Translation Keys Reference Map

### rentalOpportunity Translation Structure (Example: Spanish)

This is the complete translation map for the `rentalOpportunity` namespace used by `buildListingDetails()`. Unit tests should verify that the labels returned match these translation keys:

```typescript
rentalOpportunity: {
  subject: 'Nueva oportunidad de alquiler en %{listingName}',
  intro: 'Oportunidad de alquiler en',
  community: 'Comunidad',
  
  communityType: {
    developmentalDisability: 'La discapacidad del desarrollo',
    farmworkerHousing: 'Vivienda para trabajadores agrícolas',
    housingVoucher: 'Vale HCV/Sección 8',
    referralOnly: 'Sólo por referencia',
    schoolEmployee: 'Empleado de la escuela',
    senior: 'Personas mayores',
    senior55: 'Personas mayores de 55 años',
    senior62: 'Personas mayores de 62 años',
    specialNeeds: 'Necesidades especiales',
    tay: 'TAY - Jóvenes en edad de transición',
    veteran: 'Veterano',
  },
  
  applicationsDue: 'Fecha límite de solicitudes',
  address: 'Dirección',
  neighborhood: 'Vecindario',
  unitType: 'Tipo de unidad',
  
  accessibilityType: {
    hearing: 'Auditiva',
    mobility: 'Movilidad',
    vision: 'Visual',
    hearingAndVision: 'Auditiva y visual',
    mobilityAndHearing: 'Movilidad y auditiva',
    mobilityAndVision: 'Movilidad y visual',
    mobilityHearingAndVision: 'Movilidad y auditiva/visual',
  },
  
  opportunityType: 'Tipo de oportunidad',
  lottery: 'Lotería',
  waitlist: 'Lista de espera',
  
  unitTypes: {
    SRO: 'SRO',
    studio: 'Estudio',
    oneBdrm: '1 dormitorio',
    twoBdrm: '2 dormitorios',
    threeBdrm: '3 dormitorios',
    fourBdrm: '4 dormitorios',
    fiveBdrm: '5 dormitorios',
  },
  
  unitCount: '%{smart_count} unidad |||| %{smart_count} unidades',
  bathCount: '%{smart_count} baño |||| %{smart_count} baños',
  rent: 'Renta',
  sqft: 'pies²',
  minIncome: 'Ingreso mínimo',
  maxIncome: 'Ingreso máximo',
  perMonth: 'por mes',
  ofIncome: 'de ingresos',
  orUpTo: 'o hasta',
  lotteryDate: 'Fecha de lotería',
  
  viewListingNotice: {
    line1: 'ESTA INFORMACIÓN PUEDE CAMBIAR',
    line2: 'Por favor, consulte el anuncio para obtener la información más actualizada',
  },
  
  viewButton: {
    en: 'View listing & apply',
    es: 'Ver listado y aplicar',
    zh: '查看列表并申请',
    vi: 'Xem danh sách và áp dụng',
    tl: 'Tingnan ang listahan at mag-apply',
    bn: 'তালিকা দেখুন এবং আবেদন করুন',
    ar: 'عرض القائمة والتقديم',
    fa: 'مشاهده لیست و اعمال',
    hy: 'Դիտեք ցուցակը և կիրառեք',
    ko: '목록 보기 및 신청',
  },
  
  footer: {
    accessibleMarketingFlyer: 'Volante de marketing accesible',
    unsubscribe: 'Cancelar suscripción',
    emailSettings: 'Configuración de correo electrónico',
  },
}
```

### Key Points for Unit Test Label Verification:

**Method Uses These Translation Keys:**

| Key Pattern | Usage in Method | Test Verification |
|---|---|---|
| `rentalOpportunity.community` | Community type label | Should be present when `reservedCommunityTypes.name` exists |
| `rentalOpportunity.communityType.{name}` | Community type value (dynamic) | Verify with mock listing names |
| `rentalOpportunity.applicationsDue` | Application due date label | Should be present when `applicationDueDate` exists |
| `rentalOpportunity.address` | Address label | **Always present** in output |
| `rentalOpportunity.neighborhood` | Neighborhood label | Should be present when `neighborhood` exists |
| `rentalOpportunity.unitType` | Accessibility types label | Should be present when `priorityTypes.length > 0` |
| `rentalOpportunity.accessibilityType.{type}` | Individual accessibility type (dynamic) | Map enum values to translation keys |
| `rentalOpportunity.opportunityType` | Opportunity type label | Only for lottery and waitlist `reviewOrderType` |
| `rentalOpportunity.{reviewOrderType}` | Review order type value (dynamic) | Verify translation key matches enum value |
| `rentalOpportunity.unitTypes.{unitTypeKey}` | Unit type label (dynamic) | Verify keys match units in `listingUnitsSummary.units` |
| `rentalOpportunity.unitCount` | Unit count (with smart_count interpolation) | Verify polyglot.t() called with `{ smart_count: count }` |
| `rentalOpportunity.bathCount` | Bathroom count (with smart_count interpolation) | Verify polyglot.t() called with `{ smart_count: baths.max }` |
| `rentalOpportunity.rent` | Rent range label | Should be present when `flatRent` or `percentageRent` exists |
| `rentalOpportunity.minIncome` | Minimum income label | Should be present when `minIncome` exists |
| `rentalOpportunity.maxIncome` | Maximum income label | Should be present when `maxIncome` exists |
| `rentalOpportunity.perMonth` | Per month suffix | Included in formatted income/rent strings |
| `rentalOpportunity.ofIncome` | "of income" suffix | Included in percentage rent strings |
| `rentalOpportunity.orUpTo` | "or up to" text | Included in mixed rent pattern only |
| `rentalOpportunity.lotteryDate` | Lottery date label | Should be present when `listingEvents` contains `publicLottery` |
| `rentalOpportunity.sqft` | Square feet suffix | Appended to sqft ranges in unit summaries |

### Mock Translation Strategy for Tests:

```typescript
const createMockPolyglot = () => {
  return {
    t: jest.fn((key: string, options?: any) => {
      // Return the key itself for easy assertion
      if (options?.smart_count) {
        return `${key}[${options.smart_count}]`;  // e.g., "rentalOpportunity.unitCount[5]"
      }
      return key;  // e.g., "rentalOpportunity.address"
    }),
  };
};

// Usage in test:
const mockPolyglot = createMockPolyglot();
service.polyglot = mockPolyglot;

// Then verify:
expect(mockPolyglot.t).toHaveBeenCalledWith('rentalOpportunity.address');
expect(mockPolyglot.t).toHaveBeenCalledWith('rentalOpportunity.unitCount', { smart_count: 5 });
```

---

## Summary for Test Planning Agent

### Method Complexity Level: **HIGH**

**Key Testing Focus Areas:**
1. **Conditional logic** - 11+ conditional sections with varying dependencies
2. **Translation integration** - Extensive i18n with dynamic key construction
3. **Complex rent formatting** - 3 mutually exclusive patterns
4. **Unit type iteration & sorting** - Order depends on external mapping
5. **Type-safe parameter handling** - Now properly typed (ListingUnitsSummary)
6. **Date and address formatting** - Dependencies on external utilities

### Critical Success Criteria:
- All conditional sections trigger correctly based on input
- Translation keys are correctly constructed and passed
- Return array structure matches email template expectations
- Formatting logic produces valid output (no backwards ranges, invalid formats)
- Edge cases handled gracefully (empty arrays, missing properties)

### Risk Areas for Testing:
- Dynamic translation key construction (missing keys fall back to key string)
- Unit type sorting with external mapping (missing keys produce NaN)
- Mixed rent type formatting (specific logic pattern verification)
- Range vs single value formatting across 4 different fields
- Empty array/object handling without defensive guards

### Required Mocks:
- **Polyglot instance** with .t() method returning consistent translations
- **formatLocalDate** method returning formatted date string
- **oneLineAddress** utility returning formatted address
- **unitTypeMapping** constant with expected unit type keys
- **ReviewOrderTypeEnum** and **ListingEventsTypeEnum** with enum values

### Test Execution Notes:
- Tests should be async (method is async)
- Use consistent test data across related tests
- Verify polyglot.t() call parameters in integration tests
- Mock dayjs behavior for date formatting consistency
- Create reusable factory functions for test data (Listing, ListingUnitsSummary objects)
