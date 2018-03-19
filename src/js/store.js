var Store = {
    state: {
        user: {
            name: '',
            savedRoutes: []
        },
        scenarios: {
            scenarioMap: [
                { label: 'Recommended Flow', name: '(RECOMMENDED) Hotel Search => Hotel Details => Hotel Availability' },
                { label: 'Fast Flow', name: '(FAST FLOW) Hotel Search => Hotel Availability' },
            ]
        },
        apiDiagram: {
            party1: "OTA",
            party2: "Travelport",
            text: `Title: API Sequence Diagram`,
            // text: `Title: API Sequence Diagram
            // Note left of A: Next API #1
            // A->B: Normal line
            // B-->C: Dashed line
            // C-->>A: Dashed open arrow
            // Note left of A: Next API #2
            // A->B: Normal line
            // B-->C: Dashed line
            // C-->>A: Dashed open arrow`,
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
        },
        output: {
            jsonObj: {
                shop: {
                    link: '',
                    name: '',
                    show: false,
                },
                details: {
                    link: '',
                    name: '',
                    show: false,
                },
                avail: {
                    link: '',
                    name: '',
                    show: false
                }
            }
        }
    }
};

export default Store;