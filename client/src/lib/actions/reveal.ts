/**
 * REVEAL ACTION
 * Usage: <div use:reveal={{ delay: 200, duration: 1000 }}>...</div>
 * This makes the element fade in and slide up when it enters the viewport.
 */

interface RevealOptions {
    delay?: number;
    duration?: number;
    y?: number; // How far it slides up (in px)
}

export function reveal(node: HTMLElement, { delay = 0, duration = 800, y = 30 }: RevealOptions = {}) {
    // 1. Set initial state (Invisible and pushed down)
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    // Using a "cubic-bezier" ease for that expensive "luxury" feel
    node.style.transition = `opacity ${duration}ms cubic-bezier(0.25, 1, 0.5, 1), transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    node.style.transitionDelay = `${delay}ms`;

    // 2. Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 3. Trigger animation
                node.style.opacity = '1';
                node.style.transform = 'translateY(0)';
                
                // 4. Cleanup (only animate once)
                observer.unobserve(node);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the item is visible
        rootMargin: "0px 0px -50px 0px" // Offset slightly so it triggers just after entering screen
    });

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
        }
    };
}