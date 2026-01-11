# Video Recording Script for Home Inventory Demo

**Target Duration**: 3-4 minutes
**Recording Tool**: OBS (Open Broadcaster Software)
**Language**: Bangla (or English)
**Format**: Screen recording with voiceover

---

## Pre-Recording Checklist

### OBS Setup (Mac)
1. **Open OBS Studio**
2. **Create New Scene**: "Home Inventory Demo"
3. **Add Display Capture**:
   - Click "+" under Sources
   - Select "macOS Screen Capture"
   - Choose your main display
   - Click "OK"
4. **Audio Setup**:
   - Enable microphone in Audio Mixer
   - Test audio levels (speak and watch meter)
   - Adjust volume if needed
5. **Recording Settings**:
   - Go to Settings → Output
   - Recording Format: MP4
   - Encoder: Apple VT H264 Hardware Encoder (recommended for Mac)
   - Quality: High
6. **Resolution**:
   - Settings → Video
   - Base Resolution: 1920x1080 (or your screen resolution)
   - Output Resolution: 1920x1080

### Browser Preparation
1. **Clear browser cache** for clean demo
2. **Close unnecessary tabs** to avoid distractions
3. **Open these tabs** (in order):
   - Tab 1: `http://localhost:5173` (Login page)
   - Tab 2: Swagger UI: `http://4.213.57.100:3100/swagger/index.html` (for reference)
4. **Prepare test credentials** on notepad/sticky note
5. **Set browser zoom to 100%**
6. **Hide bookmarks bar** for cleaner recording

### Application Preparation
1. **Start development server**:
   ```bash
   cd /Users/tilleruser/Desktop/All\ Projects/home-inventory
   npm run dev
   ```
2. **Ensure API is accessible** (test login beforehand)
3. **Prepare test data**:
   - Know which items to show
   - Have a test image ready for upload (< 5MB)
   - Know test location names

### Recording Environment
- ✅ Close Slack, email, and messaging apps (avoid notifications)
- ✅ Turn on Do Not Disturb mode
- ✅ Close unnecessary applications
- ✅ Prepare script/talking points nearby
- ✅ Have water ready (for 4-minute talk)
- ✅ Good lighting (if showing webcam)

---

## Video Script & Timeline

### **INTRO** (0:00 - 0:20) - 20 seconds

**Action**: Show login page

**Script** (Bangla):
```
Assalamu Alaikum / Namaskar,
Ami [Your Name], amar Home Inventory Management Application ta dekhabo.
Ei application ta Homebox API use kore banano hoyeche React ebong TypeScript diye.
```

**Script** (English):
```
Hello, I'm [Your Name], and I'll demonstrate my Home Inventory Management Application.
This application is built with React and TypeScript, integrating with the Homebox API.
```

**What to Show**:
- Login page clearly visible
- Point to the clean UI design
- Show the footer with version and links

---

### **SECTION 1: Authentication** (0:20 - 0:50) - 30 seconds

**Action**: Login to the application

**Script** (Bangla):
```
Prothome, ami login korbo.
Ami API er registration endpoint use kore ekta test account create korechi.
Username ebong password diye login korchi...
[Enter credentials and click Sign In]
Dekha jacche loading state, tarpor automatically inventory page e redirect hobe.
```

**Script** (English):
```
First, let me log in.
I created a test account using the API's registration endpoint.
Entering username and password...
[Enter credentials and click Sign In]
You can see the loading state, then it automatically redirects to the inventory page.
```

**What to Show**:
- Type username slowly (visible to camera)
- Type password (show password toggle working)
- Click "Sign In" button
- Show loading state briefly
- Show successful redirect to inventory

**Camera Focus**:
- Login form fields
- Sign In button
- Loading indicator

---

### **SECTION 2: Inventory Page** (0:50 - 1:40) - 50 seconds

**Action**: Browse inventory, demonstrate features

**Script** (Bangla):
```
Ekhon ami inventory page e achi.
Ekhane shob items gulo list format e dekhano hocche.
[Scroll through items]

Search functionality dekhabo...
[Type in search box]
Dekhun, real-time search korche.

Pagination o implement kora ache...
[Click next page if available]

Ekta item e click korle details page e jabe...
[Click on an item]
```

**Script** (English):
```
Now I'm on the inventory page.
Here all items are displayed in a list format.
[Scroll through items]

Let me demonstrate the search functionality...
[Type in search box]
See, it's searching in real-time.

Pagination is also implemented...
[Click next page if available]

Clicking on an item takes us to the details page...
[Click on an item]
```

**What to Show**:
- **0:50-1:05** (15s): Item list overview
  - Scroll through items
  - Show item thumbnails
  - Show item information (name, price, location)

- **1:05-1:20** (15s): Search functionality
  - Type slowly in search box: "laptop" or any item name
  - Show results filtering
  - Clear search

- **1:20-1:30** (10s): Show filters/actions
  - Point to "Add Item" button
  - Show item count

- **1:30-1:40** (10s): Navigate to item
  - Click on an item
  - Show smooth transition

**Camera Focus**:
- Search bar
- Item cards
- Pagination controls
- Add Item button

---

### **SECTION 3: Item Details** (1:40 - 2:30) - 50 seconds

**Action**: Show item details and edit functionality

**Script** (Bangla):
```
Item details page e shob information dekhano hocche.
[Point to different sections]

Bam pashe image gallery ache, thumbnails soho.
Dan pashe key details - location, quantity, price.

Niche tabs ache - Details, Attachments, Activity.
[Click through tabs]

Ekhn edit mode dekhabo...
[Click Edit button]
Form populate hoyeche current data diye.
[Make a small change]
Save korle update hobe.
[Click Save or Cancel]
```

**Script** (English):
```
The item details page shows all information.
[Point to different sections]

On the left is the image gallery with thumbnails.
On the right are key details - location, quantity, price.

Below are tabs - Details, Attachments, Activity.
[Click through tabs]

Now let me show edit mode...
[Click Edit button]
The form is populated with current data.
[Make a small change]
Saving will update the item.
[Click Save or Cancel]
```

**What to Show**:
- **1:40-1:55** (15s): Overview
  - Image gallery (left)
  - Key details panel (right)
  - Point to warranty info if available
  - Show notes section

- **1:55-2:10** (15s): Tabs
  - Click "Details" tab - show product info
  - Click "Attachments" tab - show attachments
  - Click "Activity" tab - show activity section

- **2:10-2:30** (20s): Edit functionality
  - Click "Edit" button
  - Show form with pre-filled data
  - Change quantity or name
  - Show "Save Changes" and "Cancel" buttons
  - Click Cancel to go back

**Camera Focus**:
- Image gallery area
- Key details sidebar
- Tab navigation
- Edit button and form

---

### **SECTION 4: Locations** (2:30 - 3:10) - 40 seconds

**Action**: Navigate to locations and show tree structure

**Script** (Bangla):
```
Ekhon Locations page dekhabo.
[Navigate to Locations]

Tree structure e locations organize kora ache.
[Expand/collapse nodes]

Ekta location select korle, details ebong items dekhabe.
[Click a location]

Location er moddhe items gulo list hocche.
Notun location o create kora jay.
[Show "New Location" button]
```

**Script** (English):
```
Now let me show the Locations page.
[Navigate to Locations]

Locations are organized in a tree structure.
[Expand/collapse nodes]

Selecting a location shows its details and items.
[Click a location]

Items within the location are listed here.
You can also create new locations.
[Show "New Location" button]
```

**What to Show**:
- **2:30-2:40** (10s): Navigate to Locations
  - Click "Locations" in sidebar
  - Show locations page loading

- **2:40-2:55** (15s): Tree navigation
  - Expand location nodes
  - Collapse nodes
  - Show hierarchy

- **2:55-3:10** (15s): Location details
  - Click a location
  - Show details panel
  - Show items in location
  - Point to "Add Child" button

**Camera Focus**:
- Location tree sidebar
- Selected location highlight
- Location details panel
- Items list

---

### **SECTION 5: Add Item (Optional)** (3:10 - 3:40) - 30 seconds

**Action**: Demonstrate creating a new item

**Script** (Bangla):
```
Notun item add korar process dekhabo.
[Click "Add Item"]

Modal open hobe form soho.
[Fill in details]
Name, description, quantity, price...
Location select korbo...
Attachment upload korte pari...
[Show file upload area]

Create korle, item add hobe ebong list e dekhabe.
[Click Add Item or Cancel]
```

**Script** (English):
```
Let me show the process of adding a new item.
[Click "Add Item"]

A modal opens with a form.
[Fill in details]
Name, description, quantity, price...
Select a location...
Can upload attachments...
[Show file upload area]

Creating will add the item and show it in the list.
[Click Add Item or Cancel]
```

**What to Show**:
- **3:10-3:15** (5s): Open modal
  - Click "Add Item" button
  - Modal appears with smooth animation

- **3:15-3:30** (15s): Fill form
  - Enter item name
  - Enter description
  - Set quantity (change number)
  - Set price
  - Select location from dropdown

- **3:30-3:40** (10s): File upload & submit
  - Show file upload area
  - Point to "Choose File" button
  - Click "Add Item" button (or Cancel to avoid actually creating)

**Camera Focus**:
- Add Item modal
- Form fields
- File upload area
- Submit button

---

### **SECTION 6: Responsive Design** (3:40 - 3:50) - 10 seconds

**Action**: Show responsive behavior

**Script** (Bangla):
```
Application ti responsive - mobile ebong desktop duita te kaj kore.
[Resize browser window or show DevTools device mode]
Layout automatically adjust hocche.
```

**Script** (English):
```
The application is responsive - works on both mobile and desktop.
[Resize browser window or show DevTools device mode]
The layout automatically adjusts.
```

**What to Show**:
- Open Chrome DevTools (F12)
- Click device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
- Toggle between different devices (iPhone, iPad, Desktop)
- Show layout adapting

**Camera Focus**:
- Browser window resizing
- Layout changes
- Mobile menu if applicable

---

### **CLOSING** (3:50 - 4:00) - 10 seconds

**Action**: Summarize and close

**Script** (Bangla):
```
Toh, ei chhilo amar Home Inventory Management Application.
React, TypeScript, TanStack Query use kore modern best practices follow korechi.
Dhonnobad apnader somoy deoar jonno.
```

**Script** (English):
```
So, this was my Home Inventory Management Application.
Built with React, TypeScript, and TanStack Query, following modern best practices.
Thank you for your time.
```

**What to Show**:
- Navigate back to home/inventory page
- Show clean, professional UI one last time
- Smile if on webcam

---

## Recording Steps in OBS

### Start Recording

1. **Final Check**:
   - Microphone working? ✅
   - Browser ready at login page? ✅
   - Script nearby? ✅
   - Timer ready (optional)? ✅

2. **Start Recording**:
   - Click "Start Recording" in OBS
   - Or press the hotkey (default: Cmd+Shift+R on Mac)
   - Wait 2 seconds before speaking (for clean start)

3. **During Recording**:
   - Speak clearly and at moderate pace
   - Move mouse slowly and deliberately
   - Pause briefly between sections
   - If you make a mistake, just continue (can edit later)

4. **End Recording**:
   - After closing remarks, pause for 2 seconds
   - Click "Stop Recording" in OBS
   - Or press the hotkey

### Post-Recording

1. **Locate Video File**:
   - Default: ~/Movies/ or ~/Videos/
   - File format: .mp4

2. **Review Video**:
   - Watch full video
   - Check audio levels
   - Verify all features shown
   - Look for any errors

3. **Edit (if needed)**:
   - Use iMovie (Mac) or QuickTime Player
   - Trim beginning/end if needed
   - Add simple intro/outro text (optional)
   - Keep it simple - raw is fine

4. **Export Final Video**:
   - Format: MP4 (H.264)
   - Resolution: 1080p
   - Quality: High
   - File size: Aim for < 500MB

---

## Upload Instructions

### Option 1: YouTube (Unlisted)

1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Click "CREATE" → "Upload videos"
3. Select your video file
4. **Settings**:
   - Title: "Home Inventory App - Pridesys IT Task"
   - Description: "Frontend Developer Assessment Submission"
   - Visibility: **Unlisted** (important!)
5. Click "Upload"
6. Copy the unlisted link
7. Paste in submission form

### Option 2: Google Drive

1. Go to [Google Drive](https://drive.google.com/)
2. Click "New" → "File Upload"
3. Select your video
4. Wait for upload
5. Right-click video → "Get Link"
6. **Set permission**: "Anyone with the link can view"
7. Copy link
8. Paste in submission form

---

## Troubleshooting OBS Issues

### No Audio
- Check System Preferences → Security & Privacy → Microphone
- Allow OBS to access microphone
- Restart OBS

### Choppy Recording
- Lower recording quality in Settings → Output
- Close other applications
- Use hardware encoder (Apple VT H264)

### Screen Not Capturing
- System Preferences → Security & Privacy → Screen Recording
- Allow OBS to record screen
- Restart OBS

### Large File Size
- Compress video:
  ```bash
  # Using HandBrake or ffmpeg
  ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 2M output.mp4
  ```

---

## Alternative: Quick Recording with macOS

If OBS is difficult, use built-in macOS screen recording:

1. **Press**: Cmd + Shift + 5
2. **Select**: Record Entire Screen or Selected Portion
3. **Options**:
   - Enable microphone
   - Show mouse clicks
4. **Click**: Record
5. **Stop**: Click stop button in menu bar
6. **File saves** to Desktop

---

## Tips for a Great Video

### Do's ✅
- Speak clearly and at moderate pace
- Show each feature completely
- Demonstrate actual functionality (don't just talk)
- Keep mouse movements smooth
- Mention technical stack (React, TypeScript, TanStack Query)
- Show error handling (if time permits)
- End with a summary

### Don'ts ❌
- Don't rush through features
- Don't mumble or speak too fast
- Don't have notifications popping up
- Don't show errors unless demonstrating error handling
- Don't exceed 4 minutes (aim for 3-3.5)
- Don't edit excessively (simple is fine)

---

## Emergency: If Recording Fails

### Plan B: Screenshots + Voiceover
1. Take high-quality screenshots of each page
2. Use PowerPoint or Keynote
3. Add screenshots with transitions
4. Record voiceover
5. Export as video

### Plan C: Screen Record with Zoom
1. Start Zoom meeting (alone)
2. Share screen
3. Click "Record"
4. Give demo
5. End meeting
6. Zoom saves recording automatically

---

## Final Submission Checklist

- [ ] Video recorded (3-4 minutes)
- [ ] Audio clear and audible
- [ ] All 4 pages demonstrated
- [ ] Video uploaded (YouTube unlisted or Google Drive)
- [ ] Link copied
- [ ] Link pasted in submission form
- [ ] Tested link (open in incognito mode)
- [ ] Repository access granted to reviewers
- [ ] Form submitted before deadline (9:00 AM, Jan 12)

---

## Good Luck! 🎬

Remember: The video doesn't need to be perfect. The reviewers want to see:
1. Your application works
2. You understand what you built
3. You can explain technical concepts
4. The UI matches design requirements

**Keep it simple, clear, and professional!**
