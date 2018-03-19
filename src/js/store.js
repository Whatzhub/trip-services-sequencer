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
            party1: "Client",
            party2: "Hotel Search",
            party3: "Hotel Details",
            party4: "Hotel Avail",
            title: 'API Sequence Diagram',
            text: `Title: Hotels Sequence Diagram 
    Note over Client: Recommended Flow
    Client->Hotel Search: Request
    Hotel Search-->Client: 2 secs
    Client->Hotel Details: Request
    Hotel Details-->Client: 2 secs
    Client->Hotel Avail: Request
    Hotel Avail-->Client: 3 secs
    Note over Client: Fast Flow
    Client->Hotel Search: Request
    Hotel Search-->Client: 2 secs
    Client->Hotel Avail: Request
    Hotel Avail-->Client: 3 secs`,
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
            },
            svgObj: {
                link: '',
                name: ''
            }
        }
    }
};

export default Store;