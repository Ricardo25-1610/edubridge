// Team presentation video controller
class TeamPresentationVideo {
    constructor() {
        this.scenes = [
            { id: 'intro', duration: 4000 },
            { id: 'member1', duration: 4000 },
            { id: 'member2', duration: 4000 },
            { id: 'member3', duration: 4000 },
            { id: 'member4', duration: 4000 },
            { id: 'member5', duration: 4000 },
            { id: 'closing', duration: 4000 }
        ];
        
        this.currentSceneIndex = 0;
        this.isPlaying = true;
        this.timeoutId = null;
        this.totalDuration = this.scenes.reduce((total, scene) => total + scene.duration, 0);
        this.startTime = Date.now();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startPresentation();
        this.updateProgressBar();
    }
    
    setupEventListeners() {
        const playPauseBtn = document.getElementById('playPause');
        const restartBtn = document.getElementById('restart');
        
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        restartBtn.addEventListener('click', () => this.restart());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'KeyR':
                    this.restart();
                    break;
                case 'ArrowLeft':
                    this.previousScene();
                    break;
                case 'ArrowRight':
                    this.nextScene();
                    break;
            }
        });
        
        // Mouse click to advance
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.controls')) {
                this.nextScene();
            }
        });
    }
    
    startPresentation() {
        if (!this.isPlaying) return;
        
        this.showScene(this.currentSceneIndex);
        
        if (this.currentSceneIndex < this.scenes.length - 1) {
            const currentScene = this.scenes[this.currentSceneIndex];
            this.timeoutId = setTimeout(() => {
                this.currentSceneIndex++;
                this.startPresentation();
            }, currentScene.duration);
        } else {
            // Presentation finished - restart automatically after a pause
            this.timeoutId = setTimeout(() => {
                this.restart();
            }, 2000);
        }
    }
    
    showScene(index) {
        // Hide all scenes
        document.querySelectorAll('.scene').forEach(scene => {
            scene.classList.remove('active');
        });
        
        // Show current scene
        const currentScene = document.getElementById(this.scenes[index].id);
        if (currentScene) {
            currentScene.classList.add('active');
            this.triggerSceneAnimations(this.scenes[index].id);
        }
        
        this.updateProgressBar();
    }
    
    triggerSceneAnimations(sceneId) {
        const scene = document.getElementById(sceneId);
        if (!scene) return;
        
        // Reset animations
        const animatedElements = scene.querySelectorAll('[class*="animation"], .typing-effect');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = null;
        });
        
        // Special handling for typing effect
        if (sceneId === 'member3') {
            const typingElement = scene.querySelector('.typing-effect');
            if (typingElement) {
                typingElement.style.width = '0';
                setTimeout(() => {
                    typingElement.style.animation = 'typing 2s steps(40, end), blink-caret 0.75s step-end infinite';
                }, 100);
            }
        }
        
        // Add entrance animations
        const memberCard = scene.querySelector('.member-card');
        if (memberCard) {
            memberCard.style.transform = 'translateY(50px) scale(0.9)';
            memberCard.style.opacity = '0';
            setTimeout(() => {
                memberCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                memberCard.style.transform = 'translateY(0) scale(1)';
                memberCard.style.opacity = '1';
            }, 200);
        }
        
        const content = scene.querySelector('.content');
        if (content && sceneId === 'intro') {
            content.style.transform = 'translateY(30px)';
            content.style.opacity = '0';
            setTimeout(() => {
                content.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                content.style.transform = 'translateY(0)';
                content.style.opacity = '1';
            }, 300);
        }
        
        if (content && sceneId === 'closing') {
            content.style.transform = 'scale(0.8)';
            content.style.opacity = '0';
            setTimeout(() => {
                content.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                content.style.transform = 'scale(1)';
                content.style.opacity = '1';
            }, 400);
        }
    }
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            // Resume from current position
            if (this.currentSceneIndex < this.scenes.length - 1) {
                this.startPresentation();
            } else {
                // If at the end, restart
                this.restart();
            }
        } else {
            // Pause
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
        }
        
        this.updatePlayPauseButton();
    }
    
    updatePlayPauseButton() {
        const btn = document.getElementById('playPause');
        btn.textContent = this.isPlaying ? '⏸️' : '▶️';
        btn.title = this.isPlaying ? 'Pause' : 'Play';
    }
    
    nextScene() {
        if (this.currentSceneIndex < this.scenes.length - 1) {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            this.currentSceneIndex++;
            if (this.isPlaying) {
                this.startPresentation();
            } else {
                this.showScene(this.currentSceneIndex);
            }
        }
    }
    
    previousScene() {
        if (this.currentSceneIndex > 0) {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            this.currentSceneIndex--;
            if (this.isPlaying) {
                this.startPresentation();
            } else {
                this.showScene(this.currentSceneIndex);
            }
        }
    }
    
    restart() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        
        this.currentSceneIndex = 0;
        this.isPlaying = true;
        this.startTime = Date.now();
        this.updatePlayPauseButton();
        this.startPresentation();
    }
    
    updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        if (!progressFill) return;
        
        let elapsed = 0;
        for (let i = 0; i < this.currentSceneIndex; i++) {
            elapsed += this.scenes[i].duration;
        }
        
        const progress = (elapsed / this.totalDuration) * 100;
        progressFill.style.width = `${Math.min(progress, 100)}%`;
    }
    
    // Method to export as video (for screen recording)
    playForRecording() {
        return new Promise((resolve) => {
            this.restart();
            
            // Disable controls during recording
            document.querySelector('.controls').style.display = 'none';
            
            setTimeout(() => {
                document.querySelector('.controls').style.display = 'flex';
                resolve();
            }, this.totalDuration + 1000);
        });
    }
}

// Enhanced animations and effects
class AnimationEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        this.createParticleEffects();
        this.setupMouseInteractions();
        this.setupViewportAnimations();
    }
    
    createParticleEffects() {
        // Add floating particles for intro and closing scenes
        const introScene = document.getElementById('intro');
        const closingScene = document.getElementById('closing');
        
        [introScene, closingScene].forEach((scene, index) => {
            if (!scene) return;
            
            const particleContainer = document.createElement('div');
            particleContainer.className = 'floating-particles';
            particleContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 5;
            `;
            
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: ${['#00d9ff', '#ff6b6b', '#00ff88'][i % 3]};
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: floatParticle ${5 + Math.random() * 5}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                    opacity: 0.6;
                `;
                particleContainer.appendChild(particle);
            }
            
            scene.appendChild(particleContainer);
        });
        
        // Add CSS for particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% { 
                    transform: translateY(0px) translateX(0px) scale(1);
                    opacity: 0.6;
                }
                25% { 
                    transform: translateY(-20px) translateX(10px) scale(1.2);
                    opacity: 0.8;
                }
                50% { 
                    transform: translateY(-10px) translateX(-15px) scale(0.8);
                    opacity: 1;
                }
                75% { 
                    transform: translateY(-30px) translateX(5px) scale(1.1);
                    opacity: 0.7;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupMouseInteractions() {
        // Add mouse hover effects to member cards
        document.querySelectorAll('.member-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.05)';
                card.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            });
        });
        
        // Add parallax effect to mouse movement
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            document.querySelectorAll('.floating-elements, .ui-mockup, .responsive-layout, .slides-background').forEach(el => {
                if (el) {
                    el.style.transform = `translate(${x}px, ${y}px)`;
                }
            });
        });
    }
    
    setupViewportAnimations() {
        // Add viewport-based animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.member-card, .content').forEach(el => {
            observer.observe(el);
        });
    }
}

// Audio integration (placeholder for future enhancement)
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.backgroundMusic = null;
        this.soundEffects = {};
    }
    
    async init() {
        // Placeholder for audio initialization
        // You can add background music and sound effects here
        console.log('Audio manager initialized (placeholder)');
    }
    
    playBackgroundMusic() {
        // Placeholder for background music
        console.log('Playing background music (placeholder)');
    }
    
    playTransitionSound() {
        // Placeholder for transition sound
        console.log('Playing transition sound (placeholder)');
    }
    
    stopAllAudio() {
        console.log('Stopping all audio (placeholder)');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new TeamPresentationVideo();
    const enhancer = new AnimationEnhancer();
    const audio = new AudioManager();
    
    audio.init().then(() => {
        console.log('Team presentation video initialized successfully!');
    });
    
    // Add global methods for external control
    window.TeamPresentation = {
        play: () => presentation.isPlaying || presentation.togglePlayPause(),
        pause: () => presentation.isPlaying && presentation.togglePlayPause(),
        restart: () => presentation.restart(),
        next: () => presentation.nextScene(),
        previous: () => presentation.previousScene(),
        playForRecording: () => presentation.playForRecording()
    };
    
    // Add instructions for users
    console.log(`
🎬 Traffic Checking App Team Presentation Controls:
⏯️  Spacebar: Play/Pause
🔄 R key: Restart
⬅️  Left arrow: Previous scene
➡️  Right arrow: Next scene
🖱️  Click anywhere: Next scene
    
📹 For recording: TeamPresentation.playForRecording()
    `);
});