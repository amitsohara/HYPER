const API_URL = 'http://localhost:8000';

const form = document.getElementById('mission-form');
const input = document.getElementById('mission-input');
const btn = document.getElementById('run-mission-btn');
const btnText = btn.querySelector('.btn-text');
const loader = btn.querySelector('.loader');
const errorToast = document.getElementById('error-message');

// Dashboard Elements
const resultsDashboard = document.getElementById('results-dashboard');
const goalsList = document.getElementById('goals-list');
const agentsGrid = document.getElementById('agents-grid');
const qualityScore = document.getElementById('quality-score');
const criticFeedback = document.getElementById('critic-feedback');

// History Elements
const historyGrid = document.getElementById('history-grid');
const historyLoading = document.getElementById('history-loading');
const cardTemplate = document.getElementById('history-card-template');

// Load initial history
fetchHistory();

form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const missionText = input.value.trim();
        if (!missionText) return;

        setLoading(true);
        hideError();
        resultsDashboard.classList.add('hidden');

        try {
            const response = await fetch(`${API_URL}/mission`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mission_text: missionText })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to launch mission');
            }

            const data = await response.json();
            renderDashboard(data);
            fetchHistory(); // Refresh history
            input.value = '';
            
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        btn.disabled = isLoading;
        input.disabled = isLoading;
        if (isLoading) {
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
        } else {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    }

    function showError(msg) {
        errorToast.textContent = msg;
        errorToast.classList.remove('hidden');
    }

    function hideError() {
        errorToast.classList.add('hidden');
    }

    function renderDashboard(data) {
        // Render Goals
        goalsList.innerHTML = '';
        const goals = Array.isArray(data.goals) ? data.goals : [];
        if (goals.length === 0) {
            goalsList.innerHTML = '<li>No goals generated</li>';
        } else {
            goals.forEach(goal => {
                const li = document.createElement('li');
                li.textContent = typeof goal === 'string' ? goal : (goal.description || JSON.stringify(goal));
                goalsList.appendChild(li);
            });
        }

        // Render Agents
        agentsGrid.innerHTML = '';
        const agents = Array.isArray(data.agents) ? data.agents : [];
        if (agents.length === 0) {
            agentsGrid.innerHTML = '<div class="agent-card"><p>No agents assigned</p></div>';
        } else {
            agents.forEach(agent => {
                const card = document.createElement('div');
                card.className = 'agent-card';
                const name = document.createElement('h4');
                name.textContent = agent.agent_type || (typeof agent === 'string' ? agent : 'Unknown Agent');
                const p = document.createElement('p');
                p.textContent = 'Agent activated and executed assigned sub-task successfully.';
                card.appendChild(name);
                card.appendChild(p);
                agentsGrid.appendChild(card);
            });
        }

        // Render Evaluation
        if (data.evaluation) {
            qualityScore.textContent = `${data.evaluation.quality_score || 0}/10`;
            criticFeedback.textContent = data.evaluation.feedback || 'No feedback provided.';
        } else {
            qualityScore.textContent = '-';
            criticFeedback.textContent = 'Pending...';
        }

        resultsDashboard.classList.remove('hidden');
    }

    async function fetchHistory() {
        try {
            const response = await fetch(`${API_URL}/missions`);
            if (!response.ok) throw new Error('Failed to fetch history');
            const data = await response.json();
            renderHistory(data);
        } catch (err) {
            historyLoading.textContent = `Error loading history: ${err.message}`;
        }
    }

    function renderHistory(missions) {
        historyLoading.classList.add('hidden');
        historyGrid.innerHTML = '';
        historyGrid.classList.remove('hidden');

        if (missions.length === 0) {
            historyGrid.innerHTML = '<p class="text-muted">No missions launched yet.</p>';
            return;
        }

        missions.forEach(mission => {
            const clone = cardTemplate.content.cloneNode(true);
            
            clone.querySelector('.mission-title').textContent = mission.mission_text || 'Unnamed Mission';
            clone.querySelector('.mission-id').textContent = String(mission.mission_id).substring(0, 8);
            
            const goalsCount = Array.isArray(mission.goals) ? mission.goals.length : 0;
            clone.querySelector('.goals-count').textContent = goalsCount;
            
            const agentsCount = Array.isArray(mission.agents) ? mission.agents.length : 0;
            clone.querySelector('.agents-count').textContent = agentsCount;
            
            const score = mission.evaluation?.quality_score || 0;
            clone.querySelector('.score-val').textContent = `${score}/10`;
            
            historyGrid.appendChild(clone);
        });
    }

