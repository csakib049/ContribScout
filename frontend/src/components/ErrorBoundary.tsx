import { Component, type ErrorInfo, type ReactNode } from 'react';


interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('Uncaught error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <h2 className="text-lg font-semibold">Something went wrong.</h2>
                    <p className="text-gray-500 text-sm mt-1">Try refreshing the page.</p>
                </div>
            );
        }
        return this.props.children;
    }
}