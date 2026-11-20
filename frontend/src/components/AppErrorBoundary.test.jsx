import { AppErrorBoundary } from './AppErrorBoundary';

test('React error boundary captures the underlying exception, not a blank screen', () => {
    const error = new Error('React render failed during spellcasting');
    expect(AppErrorBoundary.getDerivedStateFromError(error)).toEqual({ error });
});

test('the boundary starts without an error and does not discard children', () => {
    const boundary = new AppErrorBoundary({ children: 'Character Sheet' });
    expect(boundary.state).toEqual({ error: null, componentStack: '' });
    expect(boundary.render()).toBe('Character Sheet');
});
