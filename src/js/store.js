var Store = {
    state: {
        user: {
            name: '',
            savedRoutes: []
        },
        scenarios: {
            scenarioMap: [
                { label: 'Recommended Flow', name: 'Hotel Search => Hotel Details => Hotel Availability (Recommended)' },
                { label: 'Fast Flow', name: 'Hotel Search => Hotel Availability' },
            ]
        },
        apiDiagram: {
            text: `Title: API Sequence Diagram
            Note left of A: Next API #1
            A->B: Normal line
            B-->C: Dashed line
            C-->>A: Dashed open arrow
            Note left of A: Next API #2
            A->B: Normal line
            B-->C: Dashed line
            C-->>A: Dashed open arrow`,
            options: { theme: 'hand' }
        },
        input: {
            searchObj: {
                inDate: '', // e.g. 20180518
                outDate: '', // e.g. 20180520
                numGuests: '', // e.g. 1
                radius: '', // e.g. 3
                city: '', // e.g. Chicago
                state: '', // e.g. IL
                country: '', // e.g. US
                selectedScenarios: [] // e.g. [0, 1]
            }
        }
    }
};

export default Store;