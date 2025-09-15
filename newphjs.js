 // App State Management
const AppState = {
    currentMood: null,
    completedActivities: new Set(),
    userProgress: {
        breathingSessionsCompleted: 0,
        resourcesViewed: 0,
        forumInteractions: 0
    },
    bookmarkedResources: new Set(),
    achievements: new Set(),
    activeTimer: null, // To manage a single timer instance
};

// Utility Functions
const Utils = {
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    },
    getEncouragingMessage() {
        const messages = [
            "You're doing great!", "Every small step counts!", "Be proud of taking care of yourself!",
            "You're stronger than you think!", "Keep going, you've got this!", "Your mental health matters!",
            "Taking breaks is productive too!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    },
    createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed; left: ${Math.random() * 100}vw; top: -10px; width: 6px; height: 6px;
                background: hsl(${Math.random() * 360}, 70%, 50%); pointer-events: none; z-index: 1000;
                animation: confetti-fall 3s linear forwards;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => {
                if (document.body.contains(confetti)) {
                    document.body.removeChild(confetti);
                }
            }, 3000);
        }
    },
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    saveProgress() {
        console.log('Progress saved:', AppState.userProgress);
    }
};

// Add Confetti CSS Animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `@keyframes confetti-fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }`;
document.head.appendChild(confettiStyle);

// Enhanced Modal Management with closable state
const Modal = {
    isClosable: true, // New state to control if modal can be closed by background click/esc

    show(message, isHTML = false, isActivity = false) {
        const modal = document.getElementById('messageModal');
        const modalMessage = document.getElementById('modalMessage');

        if (!modal || !modalMessage) return;

        if (isHTML) {
            modalMessage.innerHTML = message;
        } else {
            modalMessage.textContent = message;
        }

        modal.style.display = 'flex';
        setTimeout(() => modal.style.opacity = '1', 10);

        // If it's a focused activity, prevent easy closing.
        this.isClosable = !isActivity;
    },

    hide() {
        const modal = document.getElementById('messageModal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.style.display = 'none', 300);
        }
        // Always ensure modal is closable when hidden
        this.isClosable = true;
        // Stop any active timers when modal is closed
        if (AppState.activeTimer) {
            clearInterval(AppState.activeTimer);
            AppState.activeTimer = null;
        }
    }
};

// Mental Health First Aid Navigator (with all functions implemented)
const FirstAidNavigator = {
    pomodoroState: { timeLeft: 25 * 60, isRunning: false, interval: null },

    activities: {
        'Feeling Anxious': {
            title: 'Anxiety Relief Kit',
            content: `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-blue-600 mb-4">Let's ease that anxiety together!</h3>
                    <div class="grid gap-4">
                        <button onclick="FirstAidNavigator.startBreathingExercise()" class="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg transition-colors">4-7-8 Breathing Exercise</button>
                        <button onclick="FirstAidNavigator.startGroundingExercise()" class="bg-green-100 hover:bg-green-200 p-3 rounded-lg transition-colors">5-4-3-2-1 Grounding Technique</button>
                        <button onclick="FirstAidNavigator.showProgressiveMuscleRelaxation()" class="bg-purple-100 hover:bg-purple-200 p-3 rounded-lg transition-colors">Progressive Muscle Relaxation</button>
                    </div>
                </div>`
        },
        'Overwhelmed by Stress': {
            title: 'Stress Management Toolkit',
            content: `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-red-600 mb-4">Let's tackle that stress!</h3>
                    <div class="grid gap-4">
                        <button onclick="FirstAidNavigator.createPriorityMatrix()" class="bg-red-100 hover:bg-red-200 p-3 rounded-lg transition-colors">Priority Matrix Exercise</button>
                        <button onclick="FirstAidNavigator.startPomodoroTimer()" class="bg-orange-100 hover:bg-orange-200 p-3 rounded-lg transition-colors">25-Minute Focus Session</button>
                        <button onclick="FirstAidNavigator.showStressReliefTips()" class="bg-yellow-100 hover:bg-yellow-200 p-3 rounded-lg transition-colors">Quick Stress Relief Tips</button>
                    </div>
                </div>`
        },
        'Feeling Isolated': {
            title: 'Connection & Community',
            content: `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-green-600 mb-4">You're not alone!</h3>
                    <div class="grid gap-4">
                        <button onclick="FirstAidNavigator.showConnectionActivities()" class="bg-green-100 hover:bg-green-200 p-3 rounded-lg transition-colors">Connection Activities</button>
                        <button onclick="FirstAidNavigator.startSelfCompassionPractice()" class="bg-pink-100 hover:bg-pink-200 p-3 rounded-lg transition-colors">Self-Compassion Practice</button>
                        <button onclick="PeerSupport.showForumPrompts()" class="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg transition-colors">Join Forum Discussion</button>
                    </div>
                </div>`
        },
        'Struggling with Sleep': {
            title: 'Sleep Hygiene Helper',
            content: `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-purple-600 mb-4">Sweet dreams ahead!</h3>
                    <div class="grid gap-4">
                        <button onclick="FirstAidNavigator.showSleepHygieneChecklist()" class="bg-purple-100 hover:bg-purple-200 p-3 rounded-lg transition-colors">Sleep Hygiene Checklist</button>
                        <button onclick="FirstAidNavigator.startBedtimeRoutine()" class="bg-indigo-100 hover:bg-indigo-200 p-3 rounded-lg transition-colors">Bedtime Routine Builder</button>
                        <button onclick="FirstAidNavigator.startSleepMeditation()" class="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg transition-colors">Sleep Meditation</button>
                    </div>
                </div>`
        },
        'Academic Pressure': {
            title: 'Academic Wellness Support',
            content: `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-yellow-600 mb-4">Academic success with balance!</h3>
                    <div class="grid gap-4">
                        <button onclick="FirstAidNavigator.createStudyPlan()" class="bg-yellow-100 hover:bg-yellow-200 p-3 rounded-lg transition-colors">Balanced Study Planner</button>
                        <button onclick="FirstAidNavigator.showExamAnxietyTips()" class="bg-green-100 hover:bg-green-200 p-3 rounded-lg transition-colors">Exam Anxiety Management</button>
                        <button onclick="FirstAidNavigator.startBreakTimer(5 * 60)" class="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg transition-colors">Mandatory 5-Min Break</button>
                    </div>
                </div>`
        },
        'Other': {
            title: 'Personalized Support',
            content: `
                 <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-600 mb-4">Let's find what works for you!</h3>
                    <div class="grid gap-4">
                        <button onclick="FirstAidNavigator.showMoodAssessment()" class="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors">Quick Mood Assessment</button>
                        <button onclick="FirstAidNavigator.showPersonalizedHelp()" class="bg-indigo-100 hover:bg-indigo-200 p-3 rounded-lg transition-colors">Personalized Recommendations</button>
                        <button onclick="ResourceHub.showRandomActivity()" class="bg-pink-100 hover:bg-pink-200 p-3 rounded-lg transition-colors">Surprise Wellness Activity</button>
                    </div>
                </div>`
        }
    },

    init() {
        document.querySelectorAll('#navigator button').forEach(button => {
            button.addEventListener('click', (e) => {
                const feeling = e.target.textContent.trim();
                this.showActivityForFeeling(feeling);
                e.target.classList.add('mood-selected');
                setTimeout(() => e.target.classList.remove('mood-selected'), 600);
            });
        });
    },

    showActivityForFeeling(feeling) {
        AppState.currentMood = feeling;
        const activity = this.activities[feeling];
        if (activity) {
            Modal.show(activity.content, true, false); // This is a menu, so it's closable
            Utils.showToast(`Let's work on ${feeling.toLowerCase()}!`);
        }
    },

    startBreathingExercise() {
        const breathingContent = `
            <div class="text-center space-y-6">
                <h3 class="text-2xl font-bold text-blue-600">4-7-8 Breathing Exercise</h3>
                <div class="relative">
                    <div id="breathingCircle" class="w-32 h-32 bg-blue-400 rounded-full mx-auto flex items-center justify-center transition-all duration-1000 ease-in-out">
                        <span id="breathingInstruction" class="text-white font-semibold">Get Ready</span>
                    </div>
                </div>
                <div id="breathingProgress" class="text-gray-600">
                    <span id="breathingRound">Round 1 of 4</span>
                </div>
                <button onclick="FirstAidNavigator.stopBreathingExercise()" class="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">End Session</button>
            </div>
        `;
        Modal.show(breathingContent, true, true);
        setTimeout(() => this.runBreathingCycle(1), 1000);
    },

    runBreathingCycle(currentRound) {
        if (AppState.activeTimer) clearTimeout(AppState.activeTimer); // Clear previous timer
        const totalRounds = 4;

        if (currentRound > totalRounds) {
            this.completeBreathingExercise();
            return;
        }

        const circle = document.getElementById('breathingCircle');
        const instruction = document.getElementById('breathingInstruction');
        const roundDisplay = document.getElementById('breathingRound');

        if (!circle || !instruction || !roundDisplay) return;

        roundDisplay.textContent = `Round ${currentRound} of ${totalRounds}`;

        // Inhale
        instruction.textContent = 'Breathe In';
        circle.style.transform = 'scale(1.5)';
        circle.style.backgroundColor = '#60a5fa';

        AppState.activeTimer = setTimeout(() => {
            if (!document.getElementById('breathingCircle')) return;
            // Hold
            instruction.textContent = 'Hold';
            circle.style.backgroundColor = '#3b82f6';

            AppState.activeTimer = setTimeout(() => {
                if (!document.getElementById('breathingCircle')) return;
                // Exhale
                instruction.textContent = 'Breathe Out';
                circle.style.transform = 'scale(1)';
                circle.style.backgroundColor = '#93c5fd';

                AppState.activeTimer = setTimeout(() => {
                    this.runBreathingCycle(currentRound + 1);
                }, 8000);
            }, 7000);
        }, 4000);
    },

    completeBreathingExercise() {
        const instruction = document.getElementById('breathingInstruction');
        const circle = document.getElementById('breathingCircle');

        if (instruction && circle) {
            instruction.textContent = 'Complete!';
            circle.style.backgroundColor = '#22c55e';
            AppState.userProgress.breathingSessionsCompleted++;
            Utils.showToast('Breathing exercise completed! Great job!');
            if (AppState.userProgress.breathingSessionsCompleted === 1) {
                this.unlockAchievement('First Breath', 'Completed your first breathing exercise!');
            }
        }
        Modal.isClosable = true;
    },

    stopBreathingExercise() {
        if (AppState.activeTimer) clearTimeout(AppState.activeTimer);
        AppState.activeTimer = null;
        Modal.hide();
    },

    startGroundingExercise() {
        const groundingSteps = [
            { sense: '5 things you can SEE', color: 'blue' },
            { sense: '4 things you can TOUCH', color: 'green' },
            { sense: '3 things you can HEAR', color: 'purple' },
            { sense: '2 things you can SMELL', color: 'pink' },
            { sense: '1 thing you can TASTE', color: 'yellow' }
        ];
        const groundingContent = `
            <div class="text-center space-y-6">
                <h3 class="text-2xl font-bold text-green-600">5-4-3-2-1 Grounding Technique</h3>
                <p class="text-gray-600">Focus on your senses to stay present.</p>
                <div id="groundingSteps" class="space-y-4">
                    ${groundingSteps.map((step, index) => `
                        <div class="grounding-step p-4 border-2 border-gray-200 rounded-lg" data-step="${index}" style="opacity:0; transform: translateY(10px);">
                            <div class="text-lg font-semibold text-${step.color}-600">Name ${step.sense}</div>
                            <button onclick="FirstAidNavigator.completeGroundingStep(${index})" class="mt-3 bg-${step.color}-500 text-white px-4 py-2 rounded-lg">Done ✓</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        Modal.show(groundingContent, true, true);
        setTimeout(() => this.showNextGroundingStep(0), 500);
    },

    showNextGroundingStep(stepIndex) {
        const step = document.querySelector(`.grounding-step[data-step="${stepIndex}"]`);
        if (step) {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
        }
    },

    completeGroundingStep(stepIndex) {
        const step = document.querySelector(`[data-step="${stepIndex}"]`);
        if (step) {
            step.style.opacity = '0.5';
            const button = step.querySelector('button');
            button.textContent = '✓ Completed';
            button.disabled = true;

            if (stepIndex < 4) {
                this.showNextGroundingStep(stepIndex + 1);
            } else {
                Utils.showToast('Grounding exercise completed!', 'success');
                this.unlockAchievement('Grounded', 'Completed the 5-4-3-2-1 grounding technique!');
                Modal.isClosable = true;
            }
        }
    },

    createPriorityMatrix() {
        const matrixContent = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-red-600 text-center">Priority Matrix</h3>
                <p class="text-center text-gray-600">Organize your tasks by urgency and importance.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-red-100 p-4 rounded-lg"><h4 class="font-semibold text-red-700 mb-2">Urgent & Important</h4><textarea class="w-full p-2 border rounded" placeholder="Do these first..."></textarea></div>
                    <div class="bg-yellow-100 p-4 rounded-lg"><h4 class="font-semibold text-yellow-700 mb-2">Important, Not Urgent</h4><textarea class="w-full p-2 border rounded" placeholder="Schedule these..."></textarea></div>
                    <div class="bg-blue-100 p-4 rounded-lg"><h4 class="font-semibold text-blue-700 mb-2">Urgent, Not Important</h4><textarea class="w-full p-2 border rounded" placeholder="Delegate these..."></textarea></div>
                    <div class="bg-gray-100 p-4 rounded-lg"><h4 class="font-semibold text-gray-700 mb-2">Not Urgent, Not Important</h4><textarea class="w-full p-2 border rounded" placeholder="Eliminate these..."></textarea></div>
                </div>
                <button onclick="FirstAidNavigator.savePriorityMatrix()" class="w-full bg-green-500 text-white py-3 rounded-lg">Save Matrix</button>
            </div>
        `;
        Modal.show(matrixContent, true, false);
    },

    savePriorityMatrix() {
        Utils.showToast('Priority matrix saved! You have a clear plan.', 'success');
        this.unlockAchievement('Organizer', 'Created your first priority matrix!');
        Modal.hide();
    },

    startPomodoroTimer() {
        this.pomodoroState = { timeLeft: 25 * 60, isRunning: false, interval: null };
        const timerContent = `
            <div class="text-center space-y-6">
                <h3 class="text-2xl font-bold text-orange-600">Focus Session</h3>
                <div id="pomodoroTimer" class="text-6xl font-mono font-bold text-orange-500">${Utils.formatTime(this.pomodoroState.timeLeft)}</div>
                <div class="space-x-4">
                    <button id="startPauseBtn" onclick="FirstAidNavigator.togglePomodoro()" class="bg-green-500 text-white px-6 py-3 rounded-lg">Start</button>
                    <button onclick="FirstAidNavigator.resetPomodoro()" class="bg-gray-500 text-white px-6 py-3 rounded-lg">Reset</button>
                </div>
            </div>
        `;
        Modal.show(timerContent, true, true);
    },

    togglePomodoro() {
        const btn = document.getElementById('startPauseBtn');
        if (!this.pomodoroState.isRunning) {
            this.pomodoroState.isRunning = true;
            btn.textContent = 'Pause';
            btn.classList.replace('bg-green-500', 'bg-yellow-500');
            this.pomodoroState.interval = setInterval(() => {
                this.pomodoroState.timeLeft--;
                document.getElementById('pomodoroTimer').textContent = Utils.formatTime(this.pomodoroState.timeLeft);
                if (this.pomodoroState.timeLeft <= 0) this.completePomodoroSession();
            }, 1000);
            AppState.activeTimer = this.pomodoroState.interval;
        } else {
            this.pomodoroState.isRunning = false;
            btn.textContent = 'Resume';
            btn.classList.replace('bg-yellow-500', 'bg-green-500');
            clearInterval(this.pomodoroState.interval);
            AppState.activeTimer = null;
        }
    },

    resetPomodoro() {
        clearInterval(this.pomodoroState.interval);
        AppState.activeTimer = null;
        this.pomodoroState = { timeLeft: 25 * 60, isRunning: false, interval: null };
        document.getElementById('pomodoroTimer').textContent = Utils.formatTime(25 * 60);
        const btn = document.getElementById('startPauseBtn');
        btn.textContent = 'Start';
        btn.classList.replace('bg-yellow-500', 'bg-green-500');
    },

    completePomodoroSession() {
        clearInterval(this.pomodoroState.interval);
        AppState.activeTimer = null;
        Utils.showToast('Focus session complete! Time for a break!', 'success');
        this.unlockAchievement('Focused', 'Completed a 25-minute focus session!');
        this.startBreakTimer(5 * 60);
    },

    startBreakTimer(duration) {
        let breakTime = duration;
        const breakContent = `
            <div class="text-center space-y-6">
                <h3 class="text-2xl font-bold text-green-600">Break Time!</h3>
                <div id="breakTimer" class="text-4xl font-mono font-bold text-green-500">${Utils.formatTime(breakTime)}</div>
                <p>Stretch, hydrate, or look away from the screen.</p>
                <button onclick="Modal.hide()" class="bg-gray-500 text-white px-4 py-2 rounded-lg">End Break</button>
            </div>
        `;
        Modal.show(breakContent, true, true);

        AppState.activeTimer = setInterval(() => {
            breakTime--;
            const timer = document.getElementById('breakTimer');
            if (timer) timer.textContent = Utils.formatTime(breakTime);

            if (breakTime <= 0) {
                clearInterval(AppState.activeTimer);
                AppState.activeTimer = null;
                Utils.showToast('Break time over!', 'info');
                Modal.hide();
            }
        }, 1000);
    },

    showSleepHygieneChecklist() {
        const sleepTips = [
            'Avoid caffeine 6 hours before bed', 'Keep bedroom cool, dark, and quiet', 'No screens 1 hour before sleep',
            'Establish a consistent sleep schedule', 'Avoid large meals close to bedtime', 'Get natural sunlight during the day'
        ];
        const checklistContent = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-purple-600 text-center">Sleep Hygiene Checklist</h3>
                <div class="sleep-checklist space-y-3">
                    ${sleepTips.map(tip => `<label class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"><input type="checkbox" onchange="FirstAidNavigator.updateSleepProgress()" class="w-4 h-4 text-purple-600 rounded"><span>${tip}</span></label>`).join('')}
                </div>
                <div class="text-center text-sm text-gray-500">Progress: <span id="sleepScore">0/${sleepTips.length}</span></div>
            </div>
        `;
        Modal.show(checklistContent, true, false);
    },

    updateSleepProgress() {
        const checkboxes = document.querySelectorAll('.sleep-checklist input:checked');
        const total = document.querySelectorAll('.sleep-checklist input').length;
        document.getElementById('sleepScore').textContent = `${checkboxes.length}/${total}`;
        if (checkboxes.length === total) {
            Utils.showToast('Perfect sleep hygiene!', 'success');
            this.unlockAchievement('Sleep Master', 'Completed the sleep hygiene checklist!');
        }
    },

    unlockAchievement(title, description) {
        if (!AppState.achievements.has(title)) {
            AppState.achievements.add(title);
            Utils.createConfetti();
            const achievementContent = `
                <div class="text-center space-y-4">
                    <div class="text-6xl">🏆</div>
                    <h3 class="text-2xl font-bold text-yellow-600">Achievement Unlocked!</h3>
                    <div class="text-lg font-semibold">${title}</div>
                    <p>${description}</p>
                </div>
            `;
            // Show as a temporary modal that is closable
            const currentModalContent = document.getElementById('modalMessage').innerHTML;
            const currentClosable = Modal.isClosable;
            Modal.show(achievementContent, true, false);
            setTimeout(() => {
                // Restore previous modal state if it was an activity
                if(document.querySelector('.modal').style.display !== 'none'){
                     Modal.show(currentModalContent, true, !currentClosable);
                }
            }, 3000);
        }
    },

    showProgressiveMuscleRelaxation() {
        const relaxationContent = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-purple-600 text-center">Progressive Muscle Relaxation</h3>
                <p class="text-center text-gray-600">Tense and release each muscle group to feel deep relaxation.</p>
                <ol class="list-decimal list-inside text-left space-y-2">
                    <li>Find a comfortable position and take a few deep breaths.</li>
                    <li>Starting with your feet, tense the muscles for 5 seconds.</li>
                    <li>Release the tension and relax for 10 seconds, noticing the difference.</li>
                    <li>Continue this process up through your body: legs, abdomen, arms, and face.</li>
                </ol>
                <button onclick="Modal.hide()" class="w-full bg-purple-500 text-white py-3 rounded-lg">I'm Ready</button>
            </div>
        `;
        Modal.show(relaxationContent, true, false);
    },

    showStressReliefTips() {
        const stressTips = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-yellow-600 text-center">Quick Stress Relief Tips</h3>
                <ul class="list-disc list-inside text-left space-y-2">
                    <li>Take 3 deep, slow breaths.</li>
                    <li>Stretch your neck and shoulders.</li>
                    <li>Listen to a favorite calming song.</li>
                    <li>Step outside for a minute of fresh air.</li>
                    <li>Write down what's on your mind.</li>
                </ul>
            </div>
        `;
        Modal.show(stressTips, true, false);
    },

    startBedtimeRoutine() {
        const routineSteps = [
            "Dim the lights in your room", "Put away all electronic devices", "Do some light stretching",
            "Read a chapter of a book (not on a screen)", "Listen to calming music or a podcast", "Practice deep breathing for 5 minutes"
        ];
        const routineContent = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-indigo-600 text-center">Bedtime Routine Builder</h3>
                <p class="text-center text-gray-600">Follow these steps to wind down for a restful sleep.</p>
                <div id="routineSteps" class="space-y-3">
                    ${routineSteps.map((step, index) => `
                        <div class="routine-step p-3 border-2 border-gray-200 rounded-lg opacity-50" data-step="${index}">
                           <span class="font-semibold text-indigo-700">Step ${index + 1}:</span> ${step}
                        </div>
                    `).join('')}
                </div>
                <button id="beginRoutineBtn" onclick="FirstAidNavigator.beginRoutine()" class="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600">Begin Routine</button>
            </div>
        `;
        Modal.show(routineContent, true, true);
    },

    beginRoutine() {
        document.getElementById('beginRoutineBtn').style.display = 'none';
        let currentStep = 0;
        const steps = document.querySelectorAll('.routine-step');

        const showStep = () => {
            if (currentStep < steps.length) {
                steps[currentStep].classList.remove('opacity-50');
                steps[currentStep].scrollIntoView({ behavior: 'smooth', block: 'center' });
                currentStep++;
                AppState.activeTimer = setTimeout(showStep, 3000); // Show a new step every 3 seconds
            } else {
                 Utils.showToast('Bedtime routine complete. Sleep well!', 'success');
                 Modal.isClosable = true;
            }
        };
        showStep();
    },

    startSleepMeditation() {
        const meditationContent = `
            <div class="text-center space-y-6">
                 <h3 class="text-2xl font-bold text-blue-600">5-Minute Sleep Meditation</h3>
                 <p class="text-gray-600">Let go of the day and prepare your mind for rest.</p>
                 <div id="sleepMeditationTimer" class="text-5xl font-mono font-bold text-blue-500">05:00</div>
                 <div id="sleepMeditationText" class="text-lg text-blue-700 min-h-[3rem]">Close your eyes and relax.</div>
                 <button id="beginSleepMeditationBtn" onclick="FirstAidNavigator.runSleepMeditation()" class="bg-blue-500 text-white px-6 py-2 rounded-lg">Begin</button>
            </div>`;
        Modal.show(meditationContent, true, true);
    },

    runSleepMeditation() {
        document.getElementById('beginSleepMeditationBtn').style.display = 'none';
        let timeLeft = 300; // 5 minutes
        const prompts = [
            { time: 290, text: "Breathe in deeply... and exhale slowly." }, { time: 260, text: "Release any tension in your shoulders and jaw." },
            { time: 220, text: "Imagine a wave of relaxation washing over you." }, { time: 180, text: "Let go of today's thoughts." },
            { time: 120, text: "Focus only on the sensation of your breath." }, { time: 60, text: "You are calm and ready for sleep." },
            { time: 10, text: "Prepare for deep, restful sleep." },
        ];
        const timerEl = document.getElementById('sleepMeditationTimer');
        const textEl = document.getElementById('sleepMeditationText');

        AppState.activeTimer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = Utils.formatTime(timeLeft);
            const currentPrompt = prompts.find(p => p.time === timeLeft);
            if (currentPrompt) textEl.textContent = currentPrompt.text;

            if (timeLeft <= 0) {
                clearInterval(AppState.activeTimer);
                AppState.activeTimer = null;
                textEl.textContent = "Meditation complete. Sweet dreams.";
                this.unlockAchievement('Dream Weaver', 'Completed a sleep meditation.');
                Modal.isClosable = true;
            }
        }, 1000);
    },

    createStudyPlan() {
        const planContent = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-yellow-600 text-center">Balanced Study Planner</h3>
                <p class="text-gray-600 text-center">A good plan reduces stress. Don't forget to schedule breaks!</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-yellow-50 p-4 rounded-lg"><h4 class="font-semibold text-yellow-700 mb-2">Morning</h4><textarea class="w-full p-2 border rounded" placeholder="e.g., Chapter 5 Reading..."></textarea></div>
                    <div class="bg-green-50 p-4 rounded-lg"><h4 class="font-semibold text-green-700 mb-2">Break</h4><textarea class="w-full p-2 border rounded" placeholder="Eat and relax!"></textarea></div>
                    <div class="bg-yellow-50 p-4 rounded-lg"><h4 class="font-semibold text-yellow-700 mb-2">Afternoon</h4><textarea class="w-full p-2 border rounded" placeholder="e.g., Practice Problems..."></textarea></div>
                    <div class="bg-green-50 p-4 rounded-lg"><h4 class="font-semibold text-green-700 mb-2">Evening</h4><textarea class="w-full p-2 border rounded" placeholder="Review notes, relax."></textarea></div>
                </div>
                 <button onclick="Utils.showToast('Study plan noted!', 'success'); Modal.hide();" class="w-full bg-yellow-500 text-white py-3 rounded-lg">Save Plan</button>
            </div>
        `;
        Modal.show(planContent, true, false);
    },

    showExamAnxietyTips() {
        const tipsContent = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-green-600 text-center">Managing Exam Anxiety</h3>
                <ul class="space-y-3 list-disc list-inside text-gray-700">
                    <li><span class="font-semibold">Be Prepared:</span> Study well in advance to build confidence.</li>
                    <li><span class="font-semibold">Get Good Sleep:</span> A rested mind performs better.</li>
                    <li><span class="font-semibold">Eat a Healthy Meal:</span> Avoid heavy foods or too much caffeine.</li>
                    <li><span class="font-semibold">Arrive Early:</span> Rushing increases stress.</li>
                    <li><span class="font-semibold">Read Directions Carefully:</span> Take a deep breath before you start.</li>
                    <li><span class="font-semibold">Stay Positive:</span> Remind yourself that you've prepared and can do this.</li>
                </ul>
                <button onclick="FirstAidNavigator.startBreathingExercise()" class="w-full bg-green-500 text-white py-3 rounded-lg">Try a Calming Breath</button>
            </div>
        `;
        Modal.show(tipsContent, true, false);
    },

    showMoodAssessment() {
        const moodContent = `
            <div class="space-y-6 text-center">
                <h3 class="text-2xl font-bold text-gray-700">Quick Mood Check-in</h3>
                <p class="text-gray-600">How are you feeling right at this moment?</p>
                <div class="flex justify-center gap-4 text-5xl">
                    <button onclick="FirstAidNavigator.selectMood('happy')" class="hover:scale-125 transition-transform">😊</button>
                    <button onclick="FirstAidNavigator.selectMood('calm')" class="hover:scale-125 transition-transform">😌</button>
                    <button onclick="FirstAidNavigator.selectMood('neutral')" class="hover:scale-125 transition-transform">😐</button>
                    <button onclick="FirstAidNavigator.selectMood('sad')" class="hover:scale-125 transition-transform">😔</button>
                    <button onclick="FirstAidNavigator.selectMood('stressed')" class="hover:scale-125 transition-transform">😫</button>
                </div>
                <p id="moodResponse" class="text-lg text-indigo-600 font-semibold min-h-[2rem]"></p>
            </div>
        `;
        Modal.show(moodContent, true, false);
    },

    selectMood(mood) {
        const responses = {
            happy: "That's great to hear! Keep that positive energy going.",
            calm: "It's wonderful to feel calm. Enjoy this peaceful moment.",
            neutral: "It's okay to just be. Thank you for checking in with yourself.",
            sad: "It's okay to feel sad. Be gentle with yourself today.",
            stressed: "Feeling stressed is tough. Maybe a breathing exercise could help?"
        };
        document.getElementById('moodResponse').textContent = responses[mood];
        Utils.showToast('Thanks for sharing!', 'info');
    },

    showPersonalizedHelp() {
        const helpContent = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-indigo-600 text-center">Let's Find What You Need</h3>
                <p class="text-center text-gray-600">What's most on your mind right now?</p>
                <div class="grid gap-4">
                     <button onclick="FirstAidNavigator.showActivityForFeeling('Feeling Anxious')" class="bg-blue-100 p-3 rounded-lg text-left">My thoughts are racing and I feel restless.</button>
                     <button onclick="FirstAidNavigator.showActivityForFeeling('Overwhelmed by Stress')" class="bg-red-100 p-3 rounded-lg text-left">I have too much to do and don't know where to start.</button>
                     <button onclick="FirstAidNavigator.showActivityForFeeling('Struggling with Sleep')" class="bg-purple-100 p-3 rounded-lg text-left">I can't seem to get a good night's sleep.</button>
                </div>
            </div>`;
        Modal.show(helpContent, true, false);
    },

    showConnectionActivities() {
        const connectionContent = `
            <div class="space-y-6">
                 <h3 class="text-2xl font-bold text-green-600 text-center">Simple Ways to Connect</h3>
                 <ul class="space-y-3 list-disc list-inside text-gray-700">
                    <li>Send a text to a friend or family member just to say hi.</li>
                    <li>Find a cute animal video online and share it with someone.</li>
                    <li>Make a plan to get coffee or lunch with a friend this week.</li>
                    <li>Join a club or group on campus that shares your interests.</li>
                    <li>Compliment a stranger. It can brighten both your days!</li>
                </ul>
            </div>
        `;
        Modal.show(connectionContent, true, false);
    },

    startSelfCompassionPractice() {
        const compassionContent = `
            <div class="space-y-6">
                 <h3 class="text-2xl font-bold text-pink-600 text-center">Self-Compassion Moment</h3>
                 <p class="text-center text-gray-600">Treat yourself with the same kindness you'd give a friend. Write down one kind thing about yourself.</p>
                 <textarea class="w-full p-3 border rounded-lg resize-none" rows="3" placeholder="e.g., I am proud of myself for trying my best today..."></textarea>
                 <button onclick="Utils.showToast('Thank you for being kind to you!', 'success'); Modal.hide();" class="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600">Acknowledge Kindness</button>
            </div>
        `;
        Modal.show(compassionContent, true, false);
    }
};

const ResourceHub = {
    resources: [
        // ... (Keep original resource objects)
    ],
    init() {
        document.querySelectorAll('#resources button').forEach((button, index) => {
            button.addEventListener('click', () => {
                // Simplified, assuming button index matches resource index
            });
        });
    },
    showRandomActivity() {
        const allActivities = Object.keys(FirstAidNavigator.activities);
        const randomFeeling = allActivities[Math.floor(Math.random() * allActivities.length)];
        Utils.showToast(`Surprise! Let's try an activity for: ${randomFeeling}`, 'info');
        FirstAidNavigator.showActivityForFeeling(randomFeeling);
    }
};

const PeerSupport = {
    init() {},
    showForumPrompts() {
        const promptsContent = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-blue-600 text-center">Join the Conversation</h3>
                <p class="text-center text-gray-600">Not sure what to post? Here are some ideas to get you started.</p>
                <div class="space-y-3 text-left">
                    <div class="bg-blue-50 p-4 rounded-lg">What's a small victory you had this week?</div>
                    <div class="bg-blue-50 p-4 rounded-lg">Share a song or movie that has been comforting you lately.</div>
                    <div class="bg-blue-50 p-4 rounded-lg">What's one piece of advice you'd give to your younger self?</div>
                </div>
                 <button onclick="document.getElementById('support').scrollIntoView({behavior: 'smooth'}); Modal.hide();" class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">Go to Forum</button>
            </div>
        `;
        Modal.show(promptsContent, true, false);
    }
};

const AppointmentBooking = {
    init() {
        const bookBtn = document.getElementById('bookBtn');
        if (bookBtn) {
            bookBtn.addEventListener('click', this.showBookingForm);
        }
    },
    showBookingForm() {
        const bookingContent = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-indigo-600 text-center">Book an Appointment</h3>
                <p class="text-sm text-center text-gray-600">Connect with a professional for confidential support.</p>
                <form class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-1">Service:</label>
                        <select class="w-full p-2 border rounded-lg"><option>Individual Counseling</option><option>Academic Stress</option><option>General Consultation</option></select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-1">Preferred Date:</label>
                        <input type="date" class="w-full p-2 border rounded-lg" min="${new Date().toISOString().split('T')[0]}">
                    </div>
                     <div>
                        <label class="block text-gray-700 font-semibold mb-1">Note (Optional):</label>
                        <textarea class="w-full p-2 border rounded-lg" rows="2" placeholder="Anything you'd like us to know..."></textarea>
                    </div>
                    <button type="button" onclick="AppointmentBooking.submitBooking()" class="w-full bg-indigo-500 text-white py-3 rounded-lg">Request Appointment</button>
                </form>
            </div>
        `;
        Modal.show(bookingContent, true, false);
    },
    submitBooking() {
        Utils.showToast('Appointment requested! We will be in touch.', 'success');
        FirstAidNavigator.unlockAchievement('Self-Advocate', 'Took the step to book support!');
        Modal.hide();
    }
};


// Initialize Everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sanctuary Mental Wellness Platform Loaded!');

    FirstAidNavigator.init();
    ResourceHub.init();
    PeerSupport.init();
    AppointmentBooking.init();

    const modal = document.getElementById('messageModal');
    modal.querySelector('.close-button').addEventListener('click', () => Modal.hide());

    modal.addEventListener('click', (e) => {
        if (e.target === modal && Modal.isClosable) {
            Modal.hide();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && Modal.isClosable) {
            Modal.hide();
        }
    });

    setTimeout(() => {
        Utils.showToast('Welcome to Pause&Heal! Your mental wellness journey starts here!', 'success');
    }, 1000);

    setInterval(() => Utils.saveProgress(), 30000);

    console.log('All systems initialized successfully!');
});

// =====================================================================
// NEW FEATURE: "Instant Calm" Section
// Append this entire block to the end of your newphjs.js file.
// No other changes are needed.
// =====================================================================

const InstantCalmFeature = {
    audioContext: null,
    soundSource: null,
    isPlaying: false,

    /**
     * Retrieves a different positive quote based on the day of the year.
     * @returns {string} An uplifting quote.
     */
    getPositiveQuote() {
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const quotes = [
            "Your feelings are valid. Take a moment for yourself.", "Progress, not perfection, is what matters.",
            "You are stronger than you think, and you will get through this.", "Allow yourself to rest. It's a part of productivity.",
            "The smallest step in the right direction can be the biggest step of your life.", "Breathe. This moment is temporary.",
            "You are worthy of peace and happiness.", "It's okay not to be okay. Be gentle with yourself."
        ];
        return quotes[dayOfYear % quotes.length];
    },

    /**
     * Creates the HTML for the calming sounds player modal.
     * @returns {string} HTML content for the modal.
     */
    createSoundPlayerHTML() {
        return `
            <div class="sound-player-modal text-center space-y-6">
                <h3 class="text-2xl font-bold" style="color: var(--primary);">Calming Sounds</h3>
                <p class="text-gray-600">Select a sound to help you relax or focus. Generated in your browser.</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button class="sound-btn" onclick="InstantCalmFeature.playSound('white')">White Noise</button>
                    <button class="sound-btn" onclick="InstantCalmFeature.playSound('pink')">Pink Noise</button>
                    <button class="sound-btn" onclick="InstantCalmFeature.playSound('brown')">Brown Noise</button>
                </div>
                <button class="stop-btn mt-4" onclick="InstantCalmFeature.stopSound()">Stop Sound</button>
            </div>
        `;
    },
    
    /**
     * Shows the calming sounds player in a modal.
     */
    showSoundPlayer() {
        const soundPlayerHTML = this.createSoundPlayerHTML();
        Modal.show(soundPlayerHTML, true, false);
    },

    /**
     * Plays a selected type of noise using the Web Audio API.
     * @param {string} type - The type of noise ('white', 'pink', or 'brown').
     */
    playSound(type) {
        if (this.isPlaying) {
            this.stopSound();
        }
        
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            let noise;
            if (type === 'white') {
                noise = Math.random() * 2 - 1;
            } else if (type === 'pink') {
                const b0 = 0.99886 * lastOut + (Math.random() * 2 - 1) * 0.0555179;
                const b1 = 0.99332 * lastOut + (Math.random() * 2 - 1) * 0.0750759;
                const b2 = 0.96900 * lastOut + (Math.random() * 2 - 1) * 0.1538520;
                noise = b0 + b1 + b2 + (Math.random() * 2 - 1) * 0.01;
                lastOut = noise;
                noise *= 0.11;
            } else { // brown
                const white = Math.random() * 2 - 1;
                noise = (lastOut + (0.02 * white)) / 1.02;
                lastOut = noise;
                noise *= 3.5;
            }
            output[i] = noise;
        }

        this.soundSource = this.audioContext.createBufferSource();
        this.soundSource.buffer = noiseBuffer;
        this.soundSource.loop = true;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime); // Set volume to 10%
        this.soundSource.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        this.soundSource.start(0);
        this.isPlaying = true;
        Utils.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} noise playing.`, 'info');
    },

    /**
     * Stops any currently playing sound.
     */
    stopSound() {
        if (this.soundSource && this.isPlaying) {
            this.soundSource.stop(0);
            this.isPlaying = false;
            Utils.showToast('Sound stopped.', 'info');
        }
    },
    
    /**
     * Initializes the feature by injecting CSS and rearranging the HTML structure.
     */
    init() {
        // Step 1: Inject all necessary CSS into the head for the new layout and components.
        const style = document.createElement('style');
        style.textContent = `
            .balanced-layout {
                display: grid;
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            @media (min-width: 1024px) {
                .balanced-layout {
                    grid-template-columns: 2fr 1fr;
                }
            }
            .instant-calm-card {
                background-color: var(--secondary);
                border-radius: 1.5rem;
                padding: 1.5rem;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .instant-calm-card h3 {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--text-dark);
                text-align: center;
                margin-bottom: 1rem;
            }
            .positive-focus-card {
                background: rgba(255, 255, 255, 0.5);
                border-radius: 1rem;
                padding: 1rem;
                flex-grow: 1;
                margin-bottom: 1rem;
            }
            .positive-focus-card h4 {
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            .positive-focus-card p {
                font-style: italic;
                color: var(--text-dark);
            }
            .instant-calm-buttons {
                display: grid;
                gap: 0.75rem;
            }
            .instant-calm-buttons button, .sound-btn, .stop-btn {
                width: 100%;
                padding: 0.75rem;
                border-radius: 0.75rem;
                font-weight: 600;
                transition: all 0.2s ease;
                border: none;
            }
            .instant-calm-buttons button {
                 background-color: var(--primary);
                 color: var(--text-light);
            }
            .sound-btn { background-color: var(--secondary); color: var(--text-dark); }
            .stop-btn { background-color: #BF616A; color: var(--text-light); }
            .instant-calm-buttons button:hover, .sound-btn:hover, .stop-btn:hover {
                transform: translateY(-2px);
                filter: brightness(1.1);
            }
        `;
        document.head.appendChild(style);

        // Step 2: Find the main card and the grid of buttons we need to rearrange.
        const navigatorCard = document.querySelector('#navigator .card');
        const feelingButtonsGrid = navigatorCard ? navigatorCard.querySelector('.grid') : null;

        if (!navigatorCard || !feelingButtonsGrid) {
            console.error('Could not find the navigator card to apply the Instant Calm feature.');
            return;
        }

        // Step 3: Create the new two-column layout structure.
        const mainContainer = document.createElement('div');
        mainContainer.className = 'balanced-layout';

        const leftColumn = document.createElement('div');
        const rightColumn = document.createElement('div');

        // Step 4: Move the existing grid of feeling buttons into the left column.
        leftColumn.appendChild(feelingButtonsGrid);

        // Step 5: Create the HTML for the new "Instant Calm" section.
        const quote = this.getPositiveQuote();
        rightColumn.innerHTML = `
            <div class="instant-calm-card">
                <h3>Instant Calm</h3>
                <div class="positive-focus-card">
                    <h4>✨ Positive Focus</h4>
                    <p>"${quote}"</p>
                </div>
                <div class="instant-calm-buttons">
                    <button onclick="InstantCalmFeature.showSoundPlayer()">🎧 Listen to Calming Sounds</button>
                    <button onclick="FirstAidNavigator.startBreathingExercise()">🌬️ 1-Minute Breathing Guide</button>
                </div>
            </div>
        `;

        // Step 6: Assemble the new layout and replace the card's original content.
        mainContainer.appendChild(leftColumn);
        mainContainer.appendChild(rightColumn);
        navigatorCard.innerHTML = '';
        navigatorCard.appendChild(mainContainer);
    }
};

/**
 * Add a new DOMContentLoaded listener. This will run after the original one,
 * ensuring all required components like 'Modal' and 'FirstAidNavigator' are available.
 */
document.addEventListener('DOMContentLoaded', () => {
    // A brief delay to ensure the original DOM is fully parsed and available.
    setTimeout(() => {
        if (typeof Utils !== 'undefined' && typeof FirstAidNavigator !== 'undefined') {
            InstantCalmFeature.init();
            console.log('"Instant Calm" feature initialized!');
        } else {
            console.error('Main application components not found. "Instant Calm" feature could not be loaded.');
        }
    }, 100); 
    
    // Ensure sound stops if the modal is closed.
    const modal = document.getElementById('messageModal');
    if (modal) {
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.attributeName === 'style') {
                    const newStyle = modal.style.display;
                    if (newStyle === 'none' && InstantCalmFeature.isPlaying) {
                        InstantCalmFeature.stopSound();
                    }
                }
            }
        });
        observer.observe(modal, { attributes: true });
    }
});




// =====================================================================
// NEW FEATURE: Interactive Forum Posts (Like, Reply, Share)
// Append this entire block to the end of your newphjs.js file.
// No other changes are needed.
// =====================================================================

const ForumFeatures = {
    /**
     * Initializes the feature by finding all forum posts and enhancing them.
     */
    init() {
        this.injectCSS();
        
        const posts = document.querySelectorAll('#support .card .bg-gray-100');
        if (posts.length === 0) {
            console.warn('No forum posts found to enhance.');
            return;
        }

        posts.forEach((post, index) => {
            // Assign a unique ID to each post for targeting replies
            const postId = `post-${index}`;
            post.id = postId;
            this.addInteractionBar(post, postId);
        });
    },

    /**
     * Injects the necessary CSS for the new UI elements into the document head.
     */
    injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .interaction-bar {
                margin-top: 1rem;
                padding-top: 0.5rem;
                border-top: 1px solid #e5e7eb;
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .interaction-btn {
                background: none;
                border: none;
                cursor: pointer;
                color: #6b7280;
                display: flex;
                align-items: center;
                gap: 0.35rem;
                font-weight: 600;
                transition: color 0.2s ease;
            }
            .interaction-btn:hover {
                color: var(--primary);
            }
            .interaction-btn.liked {
                color: var(--accent, #D8A7B1); /* Use accent color if available */
            }
            .interaction-btn i {
                font-size: 1rem;
            }
            .reply-box {
                margin-top: 1rem;
                display: flex;
                gap: 0.5rem;
            }
            .reply-box textarea {
                flex-grow: 1;
                border: 1px solid #d1d5db;
                border-radius: 0.5rem;
                padding: 0.5rem;
                resize: vertical;
                min-height: 40px;
            }
            .reply-box button {
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                border: none;
                background-color: var(--primary);
                color: var(--text-light);
            }
            .comment-section {
                margin-top: 1rem;
                padding-left: 1rem;
                border-left: 2px solid #e5e7eb;
            }
            .comment {
                background-color: #f9fafb;
                padding: 0.75rem;
                border-radius: 0.5rem;
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Creates and appends the interaction bar (Like, Reply, Share) to a post.
     * @param {HTMLElement} postElement - The forum post element.
     * @param {string} postId - The unique ID of the post.
     */
    addInteractionBar(postElement, postId) {
        const bar = document.createElement('div');
        bar.className = 'interaction-bar';

        bar.innerHTML = `
            <button class="interaction-btn" onclick="ForumFeatures.handleLike(this)">
                <i class="far fa-heart"></i>
                <span class="like-counter">0</span>
            </button>
            <button class="interaction-btn" onclick="ForumFeatures.handleReply('${postId}')">
                <i class="far fa-comment-dots"></i>
                <span>Reply</span>
            </button>
            <button class="interaction-btn" onclick="ForumFeatures.handleShare()">
                <i class="far fa-share-square"></i>
                <span>Share</span>
            </button>
        `;

        postElement.appendChild(bar);
    },

    /**
     * Handles the logic for the "Like" button click.
     * @param {HTMLElement} button - The like button that was clicked.
     */
    handleLike(button) {
        button.classList.toggle('liked');
        const counter = button.querySelector('.like-counter');
        const icon = button.querySelector('i');
        let count = parseInt(counter.textContent);

        if (button.classList.contains('liked')) {
            count++;
            icon.className = 'fas fa-heart'; // Solid heart when liked
        } else {
            count--;
            icon.className = 'far fa-heart'; // Outline heart when not liked
        }
        counter.textContent = count;
    },

    /**
     * Handles the logic for the "Reply" button click, showing a reply input box.
     * @param {string} postId - The ID of the post to reply to.
     */
    handleReply(postId) {
        const postElement = document.getElementById(postId);
        const existingReplyBox = postElement.querySelector('.reply-box');

        if (existingReplyBox) {
            existingReplyBox.remove();
            return;
        }

        const replyBox = document.createElement('div');
        replyBox.className = 'reply-box';
        replyBox.innerHTML = `
            <textarea placeholder="Write a reply..."></textarea>
            <button onclick="ForumFeatures.postReply('${postId}')">Post</button>
        `;
        postElement.appendChild(replyBox);
        replyBox.querySelector('textarea').focus();
    },

    /**
     * Handles posting the reply to the correct comment section.
     * @param {string} postId - The ID of the post where the reply is being posted.
     */
    postReply(postId) {
        const postElement = document.getElementById(postId);
        const textarea = postElement.querySelector('.reply-box textarea');
        const replyText = textarea.value.trim();

        if (replyText === '') return;

        let commentSection = postElement.querySelector('.comment-section');
        if (!commentSection) {
            commentSection = document.createElement('div');
            commentSection.className = 'comment-section';
            postElement.appendChild(commentSection);
        }

        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.textContent = replyText;
        commentSection.appendChild(newComment);

        postElement.querySelector('.reply-box').remove(); // Clean up input box
    },

    /**
     * Handles the "Share" button click by showing a share modal.
     */
    handleShare() {
        const shareContent = `
            <div class="text-center space-y-4">
                <h3 class="text-2xl font-bold" style="color: var(--primary);">Share this Page</h3>
                <p class="text-gray-600">Copy the link below to share this resource with others.</p>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="text" readonly value="${window.location.href}" id="shareLinkInput" class="w-full p-2 border rounded-lg bg-gray-100">
                    <button onclick="ForumFeatures.copyShareLink()" class="p-2 px-4 rounded-lg" style="background-color: var(--primary); color: var(--text-light);">Copy</button>
                </div>
            </div>
        `;
        Modal.show(shareContent, true, false);
    },

    /**
     * Copies the URL to the clipboard.
     */
    copyShareLink() {
        const input = document.getElementById('shareLinkInput');
        input.select();
        input.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand('copy');
            Utils.showToast('Link copied to clipboard!', 'success');
        } catch (err) {
            Utils.showToast('Failed to copy link.', 'warning');
            console.error('Copy to clipboard failed:', err);
        }
        Modal.hide();
    }
};

/**
 * Add a new DOMContentLoaded listener to initialize the forum features
 * after the main application has loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    // A brief delay ensures that the main UI is fully rendered before we enhance it.
    setTimeout(() => {
        if (typeof Utils !== 'undefined' && typeof Modal !== 'undefined') {
            ForumFeatures.init();
            console.log('Forum interaction features initialized!');
        } else {
            console.error('Main application components not found. Forum features could not be loaded.');
        }
    }, 200); // This delay allows other scripts to finish first
});

// =====================================================================
// NEW FEATURE: Detailed Content for "Managing Exam Stress" Guide
// Append this entire block to the end of your newphjs.js file.
// No other changes are needed.
// =====================================================================

const ExamStressGuideFeature = {
    /**
     * Injects CSS for better formatting of the guide content in the modal.
     */
    injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .guide-section {
                padding-bottom: 1rem;
                margin-bottom: 1rem;
                border-bottom: 1px solid #e5e7eb; /* A light separator line */
            }
            .guide-section:last-child {
                border-bottom: none; /* Remove line from the last section */
                margin-bottom: 0;
            }
            .guide-section h4 {
                 font-size: 1.125rem; /* 18px */
                 font-weight: 600;
                 color: var(--primary); /* Use the theme's primary color */
                 margin-bottom: 0.75rem;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Creates the HTML content for the exam stress guide modal.
     * @returns {string} The formatted HTML string.
     */
    getGuideHTML() {
        return `
            <div class="space-y-4 text-left">
                <h3 class="text-2xl font-bold text-center mb-6" style="color: var(--primary);">🧘 Managing Exam Stress – A Complete Guide</h3>

                <div class="guide-section">
                    <h4>1. Plan and Organize</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700">
                        <li>Make a realistic study timetable (include breaks).</li>
                        <li>Break large topics into smaller, manageable chunks.</li>
                        <li>Prioritize subjects based on weightage and difficulty.</li>
                        <li>Use planners or apps to track your progress.</li>
                    </ul>
                </div>

                <div class="guide-section">
                    <h4>2. Effective Study Techniques</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700">
                        <li><b>Pomodoro Technique:</b> Study for 25–50 mins, then take a 5–10 min break.</li>
                        <li><b>Active Recall:</b> Test yourself with past papers instead of just passive reading.</li>
                        <li>Summarize topics with mind maps, flashcards, or notes.</li>
                        <li><b>Teach it:</b> Explaining a concept to a friend (or yourself) reinforces learning.</li>
                    </ul>
                </div>

                <div class="guide-section">
                    <h4>3. Take Care of Your Body</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700">
                        <li><b>Sleep:</b> Aim for 7–8 hours. Avoid all-nighters as they impair memory.</li>
                        <li><b>Food:</b> Eat balanced meals. Avoid too much caffeine, sugar, and junk food.</li>
                        <li><b>Exercise:</b> Even 15–20 mins of walking or stretching boosts memory and reduces anxiety.</li>
                    </ul>
                </div>

                <div class="guide-section">
                    <h4>4. Manage Your Mind</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700">
                        <li>Practice deep breathing, meditation, or mindfulness for a few minutes daily.</li>
                        <li><b>Positive Self-Talk:</b> Replace "I’ll fail" with "I’m prepared, and I’ll do my best."</li>
                        <li>Avoid comparing yourself with peers—focus on your own progress.</li>
                    </ul>
                </div>

                <div class="guide-section">
                    <h4>5. Break the Stress Cycle</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700">
                        <li>Schedule small relaxation breaks (music, journaling, a short walk).</li>
                        <li>Stay connected with supportive friends or family.</li>
                        <li>Laugh—watch something funny, it reduces tension instantly.</li>
                    </ul>
                </div>
                
                <div class="guide-section">
                    <h4>6. Exam Day Tips</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700">
                        <li>Prepare essentials (admit card, stationery, water bottle) the night before.</li>
                        <li>Avoid last-minute cramming. Just review key points or formulas.</li>
                        <li>Reach the exam center early to avoid panic.</li>
                        <li>During the exam, take 2–3 deep breaths if you feel overwhelmed.</li>
                    </ul>
                </div>

                <div class="guide-section">
                    <h4>7. After the Exam</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700">
                        <li>Don’t overanalyze your answers right away.</li>
                        <li>Shift focus to the next paper or reward yourself with rest. You've earned it!</li>
                    </ul>
                </div>
            </div>
        `;
    },

    /**
     * Initializes the feature by finding the specific guide button and attaching a new click event.
     */
    init() {
        this.injectCSS();
        
        // This selector specifically targets the button inside the card with the 'exam-stress' class.
        const guideButton = document.querySelector('#resources .resource-card.exam-stress button');

        if (guideButton) {
            // Override any existing click event with our new, detailed content.
            guideButton.addEventListener('click', (event) => {
                event.preventDefault(); // Stop any default behavior
                const guideContent = this.getGuideHTML();
                Modal.show(guideContent, true, false); // Use the existing modal system
                Utils.showToast('Here is your guide to managing exam stress!', 'info');
            });
        } else {
            console.warn('The "Managing Exam Stress" button was not found. The guide content could not be loaded.');
        }
    }
};

/**
 * Add a new DOMContentLoaded listener to initialize the Exam Stress Guide feature
 * after the main application has loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    // A brief delay ensures that the main UI is fully rendered before we enhance it.
    setTimeout(() => {
        if (typeof Modal !== 'undefined' && typeof Utils !== 'undefined') {
            ExamStressGuideFeature.init();
            console.log('Exam Stress Guide feature initialized!');
        } else {
            console.error('Main application components not found. Exam Stress Guide could not be loaded.');
        }
    }, 300); // This delay allows other scripts to finish first
});

// =====================================================================
// NEW FEATURE: Achievements Viewer
// Append this entire block to the end of your newphjs.js file.
// No other changes are needed.
// =====================================================================

const AchievementsFeature = {
    // A master list of all possible achievements in the app.
    // This allows us to show both locked and unlocked states.
    allAchievements: {
        'First Breath': {
            description: 'Completed your first breathing exercise!',
            icon: '🌬️'
        },
        'Grounded': {
            description: 'Completed the 5-4-3-2-1 grounding technique!',
            icon: '🌳'
        },
        'Organizer': {
            description: 'Created your first priority matrix!',
            icon: '📋'
        },
        'Focused': {
            description: 'Completed a 25-minute focus session!',
            icon: '🎯'
        },
        'Sleep Master': {
            description: 'Completed the sleep hygiene checklist!',
            icon: '🛌'
        },
        'Dream Weaver': {
            description: 'Completed a sleep meditation.',
            icon: '✨'
        },
        'Self-Advocate': {
            description: 'Took the step to book support!',
            icon: '❤️'
        },
        'Social Butterfly': {
            description: 'Engaged with the peer support forum.',
            icon: '💬'
        }
    },

    /**
     * Injects the necessary CSS for the floating button and the modal display.
     */
    injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            #achievements-btn {
                position: fixed;
                bottom: 1.5rem;
                left: 1.5rem;
                z-index: 999;
                width: 3.5rem;
                height: 3.5rem;
                border-radius: 50%;
                background-color: var(--primary);
                color: var(--text-light);
                border: none;
                box-shadow: 0 8px 20px rgba(58, 50, 47, 0.25);
                font-size: 1.5rem;
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #achievements-btn:hover {
                transform: translateY(-4px) scale(1.05);
                box-shadow: 0 12px 25px rgba(58, 50, 47, 0.3);
            }
            .achievement-list {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            @media (min-width: 640px) {
                .achievement-list {
                    grid-template-columns: 1fr 1fr;
                }
            }
            .achievement-item {
                padding: 1rem;
                border-radius: 0.75rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                transition: background-color 0.2s ease;
            }
            .achievement-item.unlocked {
                background-color: rgba(78, 148, 165, 0.1); /* Light primary color */
                border: 1px solid var(--primary);
            }
            .achievement-item.locked {
                background-color: #f3f4f6; /* Light gray */
                opacity: 0.7;
            }
            .achievement-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }
            .achievement-details h4 {
                font-weight: 600;
                color: var(--text-dark);
            }
             .achievement-details p {
                font-size: 0.875rem;
                color: #4b5563;
            }
            .achievement-item.locked .achievement-details h4 {
                color: #6b7280;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Creates and adds the floating achievements button to the page.
     */
    createAchievementsButton() {
        const button = document.createElement('button');
        button.id = 'achievements-btn';
        button.title = 'View My Achievements';
        button.innerHTML = '🏆';
        
        button.addEventListener('click', () => {
            this.showAchievementsModal();
        });

        document.body.appendChild(button);
    },

    /**
     * Builds the HTML for the achievements modal and displays it.
     */
    showAchievementsModal() {
        let achievementsHTML = '';
        const unlockedCount = AppState.achievements.size;
        const totalCount = Object.keys(this.allAchievements).length;

        // Iterate over our master list of all possible achievements
        for (const key in this.allAchievements) {
            const achievement = this.allAchievements[key];
            const isUnlocked = AppState.achievements.has(key);

            if (isUnlocked) {
                achievementsHTML += `
                    <div class="achievement-item unlocked">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-details">
                            <h4>${key}</h4>
                            <p>${achievement.description}</p>
                        </div>
                    </div>
                `;
            } else {
                achievementsHTML += `
                    <div class="achievement-item locked">
                        <div class="achievement-icon">❓</div>
                        <div class="achievement-details">
                            <h4>Locked Achievement</h4>
                            <p>Keep exploring to unlock this!</p>
                        </div>
                    </div>
                `;
            }
        }

        const modalHTML = `
            <div class="text-center space-y-6">
                <h3 class="text-2xl font-bold" style="color: var(--primary);">My Achievements</h3>
                <p class="text-gray-600">You've unlocked ${unlockedCount} of ${totalCount} achievements. Great job!</p>
                <div class="achievement-list">${achievementsHTML}</div>
            </div>
        `;
        
        Modal.show(modalHTML, true, false);
    },
    
    /**
     * Initializes the entire feature.
     */
    init() {
        this.injectCSS();
        this.createAchievementsButton();
    }
};

/**
 * Add a new DOMContentLoaded listener to initialize the Achievements feature
 * after the main application has loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    // A brief delay ensures that the main UI is fully rendered before we enhance it.
    setTimeout(() => {
        if (typeof Modal !== 'undefined' && typeof AppState !== 'undefined') {
            AchievementsFeature.init();
            console.log('Achievements feature initialized!');
        } else {
            console.error('Main application components not found. Achievements feature could not be loaded.');
        }
    }, 400); // This delay allows other scripts to finish first
});

// =====================================================================
// NEW FEATURE: Symptom Checker with Personalized Suggestions (UPDATED with new data)
// Replace the previous SymptomCheckerFeature block with this one.
// =====================================================================

const SymptomCheckerFeature = {
    selectedSymptoms: new Set(),

    // Master data has been UPDATED with your new list of suggestions.
    symptomData: {
        'Racing Thoughts': {
            suggestions: [
                'Do a “brain dump” on paper, then shred it or put it away.',
                'Try guided meditation apps that focus on slowing thinking.',
                'Read something light (fiction, poetry) to shift mental pace.',
                'Take a warm shower or bath to physically relax.'
            ]
        },
        'Low Energy': {
            suggestions: [
                'Do a quick power nap (15–20 mins).',
                'Splash cold water on your face or hands.',
                'Try a short burst of jumping jacks or dancing.',
                'Change your environment (open windows, move rooms).'
            ]
        },
        'Can\'t Focus': {
            suggestions: [
                'Chew gum to stimulate alertness.',
                'Use noise-cancelling headphones or background “focus” sounds.',
                'Make a priority list of only 3 tasks for the day.',
                'Set a timer for just 2 minutes and start — momentum often builds.'
            ]
        },
        'Feeling Tense': {
            suggestions: [
                'Try aromatherapy (lavender, peppermint, or eucalyptus oils).',
                'Do slow yoga poses (child’s pose, forward fold).',
                'Use a warm compress on your shoulders or back.',
                'Try drawing or doodling to release tension.'
            ]
        },
        'Sad or Empty': {
            suggestions: [
                'Watch a funny video or comedy show for mood lift.',
                'Volunteer or help someone else (gives meaning + connection).',
                'Create a gratitude list (even 3 small things).',
                'Go outside and notice nature — trees, sky, sounds.'
            ]
        },
        'Irritable': {
            suggestions: [
                'Listen to calming or instrumental music.',
                'Squeeze a stress ball or knead clay/playdough.',
                'Practice reframing thoughts: “Is this worth my energy?”',
                'Journal out frustrations instead of directing them at others.'
            ]
        }
    },

    /**
     * Injects CSS for the new section and its components.
     */
    injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .symptom-card {
                margin-top: 2rem; /* Add space below the previous card */
            }
            .symptom-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 0.75rem;
            }
            .symptom-btn {
                padding: 0.75rem;
                border-radius: 0.75rem;
                font-weight: 600;
                border: 2px solid #e5e7eb;
                background-color: #f9fafb;
                transition: all 0.2s ease;
                text-align: center;
            }
            .symptom-btn:hover {
                border-color: var(--primary);
                transform: translateY(-2px);
            }
            .symptom-btn.selected {
                background-color: var(--primary);
                color: var(--text-light);
                border-color: var(--primary);
                box-shadow: 0 4px 10px rgba(78, 148, 165, 0.3);
            }
            #get-suggestions-btn {
                display: none; /* Hidden by default */
                width: 100%;
                padding: 1rem;
                margin-top: 1.5rem;
                font-size: 1.125rem;
                font-weight: 700;
                border-radius: 0.75rem;
                background-color: var(--accent);
                color: var(--text-light);
            }
            /* Styling for the new list format in the modal */
            .suggestions-content h4 {
                font-size: 1.125rem;
                font-weight: 600;
                color: var(--primary);
                margin-top: 1rem;
                margin-bottom: 0.5rem;
            }
             .suggestions-content ul {
                list-style-type: disc;
                padding-left: 1.5rem;
                margin-bottom: 1rem;
            }
             .suggestions-content li {
                margin-bottom: 0.5rem;
            }
        `;
        document.head.appendChild(style);
    },
    
    /**
     * Creates the HTML structure for the new symptom checker card.
     */
    createSymptomCard() {
        const navigatorSection = document.getElementById('navigator');
        if (!navigatorSection) return;

        const card = document.createElement('div');
        card.className = 'card p-8 symptom-card';

        let symptomsHTML = '';
        for (const symptom in this.symptomData) {
            symptomsHTML += `<button class="symptom-btn" data-symptom="${symptom}">${symptom}</button>`;
        }

        card.innerHTML = `
            <h3 class="section-title mb-8" style="font-size: 1.5rem;">Or, Pinpoint How You Feel</h3>
            <div class="symptom-grid">
                ${symptomsHTML}
            </div>
            <button id="get-suggestions-btn">Get Suggestions</button>
        `;
        
        navigatorSection.appendChild(card);
        this.attachEventListeners();
    },

    /**
     * Attaches click listeners to the newly created buttons.
     */
    attachEventListeners() {
        document.querySelectorAll('.symptom-btn').forEach(button => {
            button.addEventListener('click', () => {
                const symptom = button.dataset.symptom;
                button.classList.toggle('selected');
                
                if (this.selectedSymptoms.has(symptom)) {
                    this.selectedSymptoms.delete(symptom);
                } else {
                    this.selectedSymptoms.add(symptom);
                }
                
                const suggestionsBtn = document.getElementById('get-suggestions-btn');
                suggestionsBtn.style.display = this.selectedSymptoms.size > 0 ? 'block' : 'none';
            });
        });

        document.getElementById('get-suggestions-btn').addEventListener('click', () => {
            this.showSuggestionsModal();
        });
    },

    /**
     * Compiles and displays the suggestions in a modal based on selected symptoms.
     */
    showSuggestionsModal() {
        if (this.selectedSymptoms.size === 0) return;

        let suggestionsHTML = '';
        
        this.selectedSymptoms.forEach(symptom => {
            const data = this.symptomData[symptom];
            if (data && data.suggestions) {
                suggestionsHTML += `<h4>For ${symptom}...</h4><ul>`;
                data.suggestions.forEach(tip => {
                    suggestionsHTML += `<li>${tip}</li>`;
                });
                suggestionsHTML += `</ul>`;
            }
        });

        const modalHTML = `
            <div class="text-center space-y-4">
                <h3 class="text-2xl font-bold" style="color: var(--primary);">Here are some things that might help</h3>
                <p class="text-gray-600">Acknowledging how you feel is a powerful first step. Here are a few simple ideas based on what you selected. Be kind to yourself.</p>
                <div class="text-left mt-4 suggestions-content">
                    ${suggestionsHTML}
                </div>
            </div>
        `;

        Modal.show(modalHTML, true, false);
    },

    /**
     * Initializes the entire feature.
     */
    init() {
        this.injectCSS();
        this.createSymptomCard();
    }
};

/**
* Add a new DOMContentLoaded listener to initialize the Symptom Checker feature
* after the main application has loaded.
*/
document.addEventListener('DOMContentLoaded', () => {
    // A brief delay ensures that the main UI is fully rendered before we enhance it.
    setTimeout(() => {
        if (typeof Modal !== 'undefined' && typeof Utils !== 'undefined') {
            SymptomCheckerFeature.init();
            console.log('Symptom Checker feature initialized!');
        } else {
            console.error('Main application components not found. Symptom Checker could not be loaded.');
        }
    }, 500); // This delay allows other scripts to finish first
});
