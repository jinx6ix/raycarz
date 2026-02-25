# Booking Form - Complete Guide

## Overview

The new booking form on tour detail pages is a professional, interactive component that handles the entire booking process directly on the tour page.

---

## Form Location

**On Tour Pages**: Right sidebar, sticky position (stays visible as user scrolls)

**Pages with Form**:
- All 33 individual tour pages at `/tours/[slug]`
- Tour pages include: 
  - Big Five Safari Masai Mara
  - Wildebeest Migration Serengeti
  - Gorilla Trekking Uganda
  - Romantic Safari Honeymoon
  - And 29 more...

---

## Form States

### State 1: Collapsed (Default)

When visitors first arrive, the form shows a summary view:

```
┌─────────────────────────────────┐
│  Tour Booking Card (Sticky)     │
├─────────────────────────────────┤
│                                 │
│  $999  (Original: $1,299)        │
│                                 │
│  ┌─────────────────────────────┐│
│  │  BOOK THIS TOUR             ││
│  └─────────────────────────────┘│
│                                 │
│  Duration: 7 days / 6 nights    │
│  Group Size: 2-8 people         │
│  Difficulty: Moderate           │
│  Best Season: July-October      │
│                                 │
│  ┌─────────────────────────────┐│
│  │  CHAT ON WHATSAPP           ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

**User Action**: Click "BOOK THIS TOUR" button

---

### State 2: Expanded (Form Open)

Clicking the button expands the form with all fields:

```
┌────────────────────────────────────┐
│  Book This Tour          [X Close] │
├────────────────────────────────────┤
│                                    │
│  First Name *    │  Last Name *    │
│  ┌──────────────┬┬──────────────┐ │
│  │ John         ││ Doe          │ │
│  └──────────────┴┴──────────────┘ │
│                                    │
│  Email *                           │
│  ┌──────────────────────────────┐ │
│  │ john@example.com             │ │
│  └──────────────────────────────┘ │
│                                    │
│  Phone *          │  Country *     │
│  ┌──────────────┬┬──────────────┐ │
│  │ +1 555-0000  ││ USA          │ │
│  └──────────────┴┴──────────────┘ │
│                                    │
│  # of Guests *    │  Start Date *  │
│  ┌──────────────┬┬──────────────┐ │
│  │ 2 people     ││ 2025-03-15   │ │
│  └──────────────┴┴──────────────┘ │
│                                    │
│  Special Requests (Optional)       │
│  ┌──────────────────────────────┐ │
│  │ Dietary requirements, etc.   │ │
│  │                              │ │
│  │                              │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  BOOK NOW - $999             │ │
│  └──────────────────────────────┘ │
│                                    │
│  We'll contact you within 24 hours │
│                                    │
└────────────────────────────────────┘
```

---

## Form Fields Explained

### Required Fields (marked with *)

#### First Name & Last Name
- Text input fields
- Required for booking confirmation
- Used in booking reference and emails

#### Email
- Standard email input
- Receives booking confirmation
- Validated for correct format
- Shows error if invalid

#### Phone Number
- Text input (accepts various formats)
- Used for contact purposes
- Required for verification

#### Country
- Text input
- Helps with tax/regulations
- Required field

#### Number of Guests
- Dropdown selector (1-10)
- Affects pricing calculations
- Required for group bookings

#### Start Date
- Date picker input
- Must be selected
- Cannot be in the past
- Used for itinerary planning

### Optional Fields

#### Special Requests
- Text area for additional notes
- Dietary requirements
- Accessibility needs
- Specific preferences
- All optional but helpful

---

## Form Validation

### Real-Time Validation

**What Happens When You Type**:
1. As you fill each field, validation runs in real-time
2. If a field has an error, red text appears below it
3. As you fix the error, the message disappears
4. No need to submit to see errors

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| First Name | Not empty | "First name required" |
| Last Name | Not empty | "Last name required" |
| Email | Valid email format | "Invalid email format" |
| Phone | Not empty | "Phone number required" |
| Country | Not empty | "Country required" |
| Guests | Selected | "Number of guests required" |
| Start Date | Selected | "Start date required" |

### Example Error States

```
First Name *
┌──────────────────┐
│ [empty field]    │
└──────────────────┘
❌ First name required    ← Red error text

Email *
┌──────────────────┐
│ invalid-email    │
└──────────────────┘
❌ Invalid email format   ← Red error text
```

---

## Submission Process

### Step 1: Fill the Form
- Enter all required information
- Add any special requests (optional)
- Errors show immediately if invalid

### Step 2: Click "BOOK NOW"
- Button shows "Submitting..." while processing
- Button is disabled during submission
- Prevents double-submission

### Step 3: Processing
- Form data sent to `/api/book` endpoint
- Nodemailer sends confirmation emails
- Takes 1-3 seconds typically

### Step 4: Success Message
Shows in green at bottom of form:
```
┌────────────────────────────────────┐
│ ✓ Booking confirmed!              │
│   Reference: SAFARI1701234567ABC   │
└────────────────────────────────────┘
```

### Step 5: Auto-Close
- Form automatically closes after 3 seconds
- Summary view returns
- Visitor can book another tour if desired

---

## Error Handling

### Validation Errors
Appear immediately as you fill the form.
Example: Missing required fields

### Submission Errors
If the booking submission fails:
```
┌────────────────────────────────────┐
│ ❌ Booking failed. Please try again.│
│                                    │
│ Or contact us directly:            │
│ +254 726 485 228                   │
└────────────────────────────────────┘
```

### Network Errors
If the API is unreachable:
```
┌────────────────────────────────────┐
│ ❌ An error occurred. Please try   │
│    again or contact us directly.   │
└────────────────────────────────────┘
```

---

## After Booking Confirmation

### What Happens Next

1. **Immediately**:
   - Success message shown
   - Booking reference displayed
   - Booking confirmation email sent to visitor

2. **Within 24 Hours**:
   - Admin receives notification email
   - Team reviews booking details
   - Team contacts visitor via email/WhatsApp
   - Itinerary finalized
   - Payment terms discussed

3. **Before Departure**:
   - Detailed trip information sent
   - Pre-tour guide provided
   - Final confirmations exchanged
   - Adventure begins!

---

## Email Confirmations

### Customer Email

When visitor submits booking, they receive:

```
Subject: Booking Confirmed #SAFARI1701234567ABC – Gorilla Trekking Uganda

From: East Africa Safari Tours

Body Contains:
✓ Tour name
✓ Booking date
✓ Number of travelers
✓ Total price
✓ Start date
✓ Booking reference
✓ WhatsApp support link
✓ Next steps information
```

### Admin Email

Admin team receives:

```
Subject: New Booking #SAFARI1701234567ABC – John Doe

From: Booking System

Body Contains:
✓ Customer name, email, phone
✓ Tour details
✓ Booking reference
✓ Customer location (country)
✓ Special requests
✓ WhatsApp contact link
✓ Timestamp (East Africa Time)
```

---

## Mobile Experience

### On Mobile Devices

The form is fully responsive:

**Collapsed View**:
- Takes full width below tour content
- Sticky positioning still works
- Touch-friendly buttons
- Easy to read pricing

**Expanded View**:
- Full-width form (with padding)
- Single column layout on small screens
- Large touch targets for inputs
- Easy scrolling through fields
- Clear submission button

**Form Fields on Mobile**:
- Input fields take full width
- Date picker uses mobile date UI
- Number selector is touch-friendly
- Plenty of spacing between fields

---

## Customization Options

### Change WhatsApp Number

In `components/tour-booking-form.tsx` line 223:

```javascript
// Current
href={`https://wa.me/+254787644555?text=...`}

// Change to your number
href={`https://wa.me/YOUR_NUMBER?text=...`}
```

Format: `+countrycode` + phone number (no spaces/dashes)

### Customize Form Fields

Add new fields:
1. Add to form state at top
2. Create input element
3. Add to validation function
4. Include in booking payload

### Customize Styling

All colors use Tailwind CSS classes:
- `bg-amber-600` - Primary button (change in Tailwind config)
- `border-amber-500` - Border color
- `text-amber-600` - Text color

---

## Testing the Form

### Quick Test (2 minutes)

1. Go to any tour page: `/tours/big-five-safari-masai-mara`
2. Click "Book This Tour" button
3. Fill out form with test data
4. Try submitting (SMTP must be configured)
5. Check success message

### Full Test (5 minutes)

1. Configure SMTP in `.env.local` (see EMAIL_SETUP.md)
2. Start dev server: `npm run dev`
3. Visit tour page
4. Fill booking form with real email
5. Submit booking
6. Check email inbox for confirmation
7. Check admin email address for notification

### Edge Cases

Test these scenarios:
- Missing required fields
- Invalid email format
- Empty special requests (should be optional)
- Multiple guests (2-10)
- Different future dates
- Various country names

---

## Troubleshooting

### Form Not Appearing

**Problem**: Booking form not visible on tour page

**Solution**:
1. Make sure you're on a tour detail page (`/tours/slug`)
2. Check browser console for JavaScript errors
3. Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)

### Validation Errors Stay

**Problem**: Error messages don't disappear when fixed

**Solution**:
1. The form has real-time clearing
2. If still seeing errors, manually clear field and retype
3. Errors clear automatically as you fix each field

### Booking Not Submitting

**Problem**: Form seems to hang when trying to submit

**Possible Causes**:
1. SMTP not configured - see EMAIL_SETUP.md
2. Network issue - check console (F12)
3. Invalid form data - check all required fields
4. API endpoint error - check server logs

### Email Not Received

**Problem**: Submitted booking but no email arrived

**Possible Causes**:
1. SMTP credentials incorrect - verify in `.env.local`
2. Email going to spam - check spam folder
3. Email domain reputation - use known provider (Gmail, SendGrid)
4. Server logs show error - check `npm run dev` console

---

## Best Practices

### For Visitors

✓ Fill all required fields completely
✓ Use a real email address
✓ Enter a valid phone number
✓ Add any special requests
✓ Check spam folder if email doesn't arrive
✓ Use WhatsApp for instant support

### For Admin Team

✓ Monitor booking emails
✓ Contact visitor within 24 hours
✓ Confirm tour availability
✓ Send detailed itinerary
✓ Collect payment
✓ Send pre-trip information

---

## Summary

The booking form is a complete, production-ready solution for capturing tour bookings directly on your website. It:

- ✅ Validates user input in real-time
- ✅ Sends professional confirmation emails
- ✅ Generates unique booking references
- ✅ Works on all devices
- ✅ Integrates WhatsApp support
- ✅ Provides excellent user experience

**Status**: Fully functional and ready for production use.
