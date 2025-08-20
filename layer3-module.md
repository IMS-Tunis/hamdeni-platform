# Layer 3 Shared Module

The `layer3-shared.js` module centralizes all logic for Layer 3 pages.

## Usage
```javascript
import initLayer3 from '../../../layer3-shared.js';
initLayer3('1.1');
```

### Parameters
- `pointId` (string): Identifier for the point, e.g. `"1.1"`.
- `options.questionsFile` (string, optional): Relative path to the questions JSON. Defaults to `layer3_questions.json`.

### Required DOM Elements
The following element IDs must exist on the page:
- `questions-container`
- `notes-list`
- `export-btn`
- `layer4-btn` (optional)
- `notes-title`
- `student-name`
- `platform-name`
- `point-title`

The module handles rendering questions, saving answers, storing reflection notes,
PDF export and unlocking Layer 4 when all notes are saved.
