# Product Requirements Document (PRD): Dynamic Prompt System

---

## 1. Feature Overview

The dynamic prompt system enhances an AI-generated podcast feature by incorporating time-based themes and variations. The Dynamic Prompt System generates contextual prompts based on a given date and time, combining overarching themes, recurring weekly variations, and special day prompts. This PRD outlines the improved data models and prompt generation process, with specific enhancements to the `Themes` feature for greater flexibility and unification.

This document highlights the key fields and should be read as an initial approach. Each data model and feature has more fields and sub-features, however they are defined at future points in time.

---

### 1.1. Themes

The `Themes` model represents time-bound instructions with variable durations, being able to represent concepts such as yearly, quarterly, monthly, or other periodic themes. Duration is derived from the start and end dates, allowing a single model to handle all theme types (e.g., a theme with a duration of ~365 days is a "yearly" theme, ~30 days is a "monthly" theme, etc.).

- **Fields:**

    - `title` (string, e.g., `"2024 Yearly Theme"`)
    - `start_date` (datetime, e.g., `"2024-01-01 00:00:00"`)
    - `end_date`: (datetime, e.g., `"2024-12-31 23:59:59"`)
    - `content`: (string, e.g., `"Focus on personal growth and resilience"`)

- **Notes:**
    - Duration is calculated as `(end_date - start_date)` during prompt generation with a specified precision, such as days, minutes, seconds.
    - Themes can span any duration (e.g., minutes, days, weeks, years), providing maximum flexibility.

### 1.2. WeeklyVariations

The `WeeklyVariations` model handles recurring instructions tied to specific days of the week, maintaining consistency with the original PRD.

- **Purpose**: Stores recurring themes for each day of the week (Sunday to Saturday).
- **Fields**:

    - `dayOfWeek` (string, e.g., `"Monday"`, `"Tuesday"`, etc.)
    - `variation` (string, e.g., `"Since it’s Monday, focus on motivational content to kick off the week."`)

- **Notes:**
    - Contains exactly 7 entries, one for each day of the week.

### 1.3. SpecialDayPrompts

The `SpecialDayPrompts` model captures unique instructions for specific dates, either recurring annually or one-time events.

- **Fields**:

    - `date` (string, `"MM-DD"` for recurring prompts, e.g., `"02-14"`, or `"YYYY-MM-DD"` for one-time prompts, e.g., `"2024-06-10"`)
    - `prompt` (string, e.g., `"Since it’s Valentine’s Day, highlight posts about love and relationships."`)
    - `recurring` (boolean, `true` for annual recurrence, `false` for one-time events)

- **Notes:**
    - Handles leap years appropriately (e.g., recurring "02-29" applies only in leap years).

### 1.4. BasePrompt

The `BasePrompt` model provides the static framing for all generated prompts.

- **Fields:**

    - `prefix`: (string, e.g., `"Generate a message that..."`)
    - `suffix`: (string, `"...in a concise and engaging way."`)

- **Notes:**
    - Only one `BasePrompt` instance per podcast

### 1.5. Episode

The `Episode` model provides the concept of a podcast episode that captures the audio output generation of human or AI generated content. An `Episode` belongs to a parent `Podcast` model.

- **Fields**:

    - `audio_file_path`: (string, path to a file, e.g. `"/app/data/2024-06-10-audio.mp4"`)
    - `title`: (string, e.g., `"Mid-June Awesomeness!"`)

### 1.6. Podcast

The `Podcast` model provides the concept of a podcast that has multiple `Episodes`.

- **Fields**:

    - `base_prompt_id`: (integer, reference to a base prompt that has a prefix and a suffix)
    - `title`: (string, e.g. `"That AI Agent Show"`)
    - `description`: (string, e.g. `"A show about digital sheep and whether counting them helps you sleep()"`)

---

## 2. Prompt Generation Process

The prompt generation process constructs a complete prompt for a given date and time by combining active themes, the weekly variation, and special day prompts, framed by the base prefix and suffix.

### 2.1. Steps

All these steps are assumed to be in the context of a `Podcast`, where a new `Episode` is being requested to be created on a given date time.

1. **Input:**

    - Receive a specific `datetime` via an HTTP request (e.g., "2024-02-14 14:30:00").

2. **Retrieve Active Themes:**

    - Query all `Themes` where `start_date <= datetime <= end_date`.
    - Calculate the duration for each active theme as `(end_date - start_date)` in seconds for precise sorting.

3. **Sort Themes:**

    - Order the active themes by duration in descending order (longest duration first).
    - If multiple themes have the same duration, sort by `start_date` ascending (earlier start first) for consistency.

4. **Retrieve Weekly Variation:**

    - Determine the day of the week from the `datetime` (e.g., "Wednesday" for "2024-02-14").
    - Fetch the corresponding `WeeklyVariation` based on `dayOfWeek`.

5. **Retrieve Special Day Prompts:**

    - Query all `SpecialDayPrompts` that apply:
        - For `recurring = True`, match the month and day of the `datetime` (e.g., "02-14").
        - For `recurring = False`, match the full date (e.g., "2024-02-14").

6. **Construct the Prompt:**
    - Combine the components in the following order:
        - `base_prompt.prefix`
        - Content of all active `Themes`, appended in sorted order (longest to shortest duration)
        - `weekly_variation.variation`
        - Content of all applicable `SpecialDayPrompts.prompt`, appended in storage order
        - `base_prompt.suffix`
    - Join all text components without additional separators for a seamless prompt.

### 2.2. Example

- **Input Datetime:** "2024-02-14 14:30:00" (Wednesday, Valentine’s Day)
- **Data:**

    - `BasePrompt`:
        - `prefix = "Create a message that "`
        - `suffix = " in an uplifting tone."`
    - `Themes`:
        - `{start_date: "2024-01-01 00:00:00", end_date: "2024-12-31 23:59:59", content: "promotes personal growth"}` (~365 days)
        - `{start_date: "2024-02-01 00:00:00", end_date: "2024-02-29 23:59:59", content: "encourages self-reflection"}` (~29 days)
    - `WeeklyVariations`:
        - `{dayOfWeek: "Wednesday", variation: "inspires creativity"}`
    - `SpecialDayPrompts`:
        - `{date: "02-14", prompt: "celebrates love", recurring: True}`

- **Process:**

    - Active themes: Yearly (~365 days), Monthly (~29 days)
    - Sorted themes: Yearly, Monthly
    - Weekly variation: "inspires creativity"
    - Special day prompt: "celebrates love"

- **Output Prompt:**

    ```
    Create a message that promotes personal growth, encourages self-reflection, inspires creativity, celebrates love in an uplifting tone.
    ```

#### 2.3. Handling Edge Cases

- **Missing Themes**: If no theme exists for the current year, quarter, month, or day, omit that component from the prompt.
- **Leap Years**: For recurring prompts with `date` as `"02-29"`, include only if the current year is a leap year.

---

### 3. Trigger Mechanism

- **Endpoint**: The system is triggered via an HTTP POST request to the implemented API endpoint.
- **Request Format**:
    ```json
    {
        "podcast_id": 1,
        "episode_dt": "2024-10-31T00:00:00Z"
    }
    ```
    - `podcast_id`: The id of the podcast that will be used to source `Themes`, `WeeklyVariations`, and `SpecialDayPrompts`.
    - `episode_dt`: A timezone-aware string in ISO 8601 format, representing the current date and time in the community's local time zone.
- **Behavior**: The system uses the `datetime` to determine the current date and generate the prompt, which is then passed to the AI agent for podcast creation.

---

## 4. Additional Notes

- **Precision:** Use timestamps (`datetime`) for `start_date` and `end_date` to support themes with durations as short as minutes.
- **Performance:** Index `start_date` and `end_date` in the database for efficient querying.
- **Consistency:** Sorting by duration and then `start_date` ensures deterministic prompt generation.
- **Leap Years:** The system correctly interprets recurring `SpecialDayPrompts` on "02-29" only in leap years.
- **Scalability:** The unified `Themes` model supports custom durations, making the system adaptable to future needs without schema changes.
- **Multiple Special Day Prompts**: Append all applicable prompts for a single date in the order they are stored in the database.
- **Token Constraints**: Ensure the complete prompt fits within a 128k token limit. Given the short length of themes (1-2 sentences), this is unlikely to be an issue.
- **Date Format Consistency**: Validate that `SpecialDayPrompts.date` follows `"MM-DD"` for recurring prompts and `"YYYY-MM-DD"` for one-time prompts.
- **Time Zone Handling**: Use the `datetime` as provided, assuming it reflects the community's local time zone.
