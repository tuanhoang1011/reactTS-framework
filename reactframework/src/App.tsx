import './App.scss';

import React from 'react';

export interface User {
    name: string;
    email: string;
}

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <p>{process.env.REACT_APP_HOST}</p>
            </div>
        );
    }
}

export default App;
