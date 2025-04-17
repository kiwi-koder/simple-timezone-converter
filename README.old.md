## Simple Timezone Converter – Specification

### 1. Overview & Story

**Why this exists**
Ever tried scheduling a global meeting only to realize your 9 am is someone else’s 2 pm—yesterday? We built this tiny tool after our own calendar disasters (RIP lunch plans) to make timezone math vanish. It’s so simple even your caffeine-deprived brain can use it.

**Goal:** A no‑friction, ultra‑minimal React app that converts a chosen date/time into up to 8 other city timezones. Autodetect your local zone, offer slick city search, and let you tweak either side to update all times.

---

### 2. Tech Stack

- **Framework:** React (function components + hooks)
- **Date handling:** date‑fns
- **Styling:** Tailwind CSS (mobile‑first, responsive)
- **City autocomplete:** Mapbox Geocoding API
- **Analytics:**
  - Google Analytics for page views, basic metrics
  - Mixpanel for interactive events (listed below)
- **Persistence:** localStorage
- **Shareable links:** Encoded state in URL query params

---

### 3. User Flow & Wireframes

1. **On Load**
   - Detect user’s local timezone via `Intl.DateTimeFormat().resolvedOptions().timeZone`.
   - Prepopulate first row:
     - City: user’s city (reverse‑geocoded or placeholder “Your Local Time”)
     - Date & Time picker: default to current date and nearest 10‑minute slot.
2. **Select Date & Time**
   - DatePicker + TimePicker (10‑minute steps).
   - Immediately show converted times for existing rows.
3. **Add Another Location** (up to 8 total)
   - Prompt free‑text city input with autocomplete.
   - On select, fetch timezone information and display new row.
4. **Adjust Any Row**
   - Clicking date/time in any row updates the master date/time and recalculates all others.
5. **Reorder/Remove**
   - Drag‑and‑drop or simple up/down buttons to reorder.
   - Remove icon to delete an entry.
6. **Share**
   - “Copy Link” button encodes current state in URL.
   - “Share with a friend” opens native share dialog (if supported).
7. **Persistence**
   - Save state in localStorage; reload restores the same cities and date/time.

> **Wireframe Key Zones**
>
> - Top: Funny intro blurb
> - Center: Vertical list of rows (city + date/time)
> - Bottom: Add button; Share + Copy Link buttons

---

### 4. Component Breakdown

| Component          | Props / State                                | Responsibilities                             |
| ------------------ | -------------------------------------------- | -------------------------------------------- |
| `App`              | –                                            | Bootstrap providers (Analytics, Router).     |
| `TimezoneRow`      | `cityName`, `timeZone`, `date`               | Displays city label and formatted date/time. |
| `DateTimePicker`   | `value`, `onChange`                          | Custom date‑ and time‑picker combo.          |
| `CitySearchInput`  | `value`, `onSelect(cityInfo)`, `disabled?`   | Free‑text input with Mapbox autocomplete.    |
| `ConversionList`   | `entries[]`, `onUpdateEntry()`, `onRemove()` | Renders dynamic list of `TimezoneRow`s.      |
| `AddCityButton`    | `onClick`                                    | Triggers adding a blank row (opens search).  |
| `ShareControls`    | `encodedState`, `onCopy`, `onShare`          | Copy link & native share dialog.             |
| `AnalyticsTracker` | –                                            | Hook to fire Mixpanel events on actions.     |

---

### 5. Data Model & State

```ts
interface Entry {
  id: string;                // uuid
  city: string;              // "New York, NY" etc.
  timeZone: string;          // IANA zone string
  dateTime: Date;            // in UTC internally
}

// App state
{
  entries: Entry[];          // max length 8
}
```

- **URL encoding:** `?data=` + `encodeURIComponent(btoa(JSON.stringify(entries)))`
- **LocalStorage key:** `"tzConverterState"`

---

### 6. Mapbox Integration

- **Endpoint:** Mapbox Geocoding API (forward geocoding)
- **Usage:** On free‑text input, debounce user typing by 300 ms, query suggestions, display top 5.
- **Selection:** On select, call Mapbox Timezone API or derive timezone via city coordinates + `Intl` fallback.

---

### 7. Date/Time Picker

- Use a lightweight React picker (e.g. `react-datepicker` styled via Tailwind) configured:
  - Step: 10 minutes
  - MinDate: today (optional)
  - Format: `yyyy‑MM‑dd HH:mm`

---

### 8. Analytics Events (Mixpanel)

| Event Name          | Properties             | Trigger                             |
| ------------------- | ---------------------- | ----------------------------------- |
| `DateTime Picked`   | `{ value: ISOString }` | User changes date/time in picker    |
| `City Added`        | `{ city, timeZone }`   | On successful city selection        |
| `City Removed`      | `{ city }`             | On remove click                     |
| `Time Adjusted`     | `{ rowId, newValue }`  | Editing time in any non-primary row |
| `Link Copied`       | `{ url }`              | On "Copy Link"                      |
| `Shared via Dialog` | `{ method }`           | On native share success             |
| `Rows Reordered`    | `{ newOrder: [ids] }`  | On drag/drop or reorder buttons     |

> **Google Analytics:** only `page_view` on App mount.

---

### 9. Styling & Theming

- **Primary color:** `#1E40AF` (blue)
- **Font:** System UI font stack
- **Spacing:** Tailwind default scale
- **Responsive:** Flex layout, stack rows vertically on mobile.

---

### 10. Deployment & Scripts

- **Build:** `npm run build` (React build)
- **Dev:** `npm start`
- **Env vars:**
  - `REACT_APP_MAPBOX_TOKEN`
  - `REACT_APP_MIXPANEL_KEY`
  - `REACT_APP_GA_ID`

---

### 11. Example UX Copy

- **Intro Blurb:** “MeetPush was born after our CEO accidentally scheduled a midnight sync in Sydney. Now you can pick your time, add cities, and boom—everyone’s on the same page.”
- **Placeholders:**
  - City input: “Search city (e.g. London)”
  - Date/time: “Select date & time”
- **Buttons:** “Add another city”, “Copy link”, “Share”
