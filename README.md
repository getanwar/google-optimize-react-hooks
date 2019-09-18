# Google Optimize React Hooks

## Installation

`npm i google-optimize-react-hooks`

## Usage

### React

```js
import React from 'react';
import { useGoogleOptimizeSPA } from 'google-optimize-react-hooks';

function Home(props) {
    const [loading, variant] = useGoogleOptimizeSPA(
        '[experimentID]',
        '[customEventName]'
    );

    if (loading) return null; // Or a loading indicator

    if (variant === '0') {
        return <OriginalExperiment />
    }

    if (variant === '1') {
        return <ExperimentA />
    }

    ...
}
```

Don't forget to put the [anti-flicker snippet code](https://developers.google.com/optimize/#the_anti-flicker_snippet_code) provided by Google Optimize in <HEAD> section of every page.
