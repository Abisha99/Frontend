document.addEventListener('DOMContentLoaded', () => {
    const connectWalletBtn = document.getElementById('connectWallet');
    const walletStatus = document.getElementById('walletStatus');
    const addEvidenceForm = document.getElementById('addEvidenceForm');
    const evidenceList = document.getElementById('evidenceList');
    let web3;
    let userAccount;

    const checkMetaMaskInstalled = () => {
        if (typeof window.ethereum !== 'undefined') {
            return true;
        }
        return false;
    };

    const updateWalletStatus = (message, isError = false) => {
        if (walletStatus) {
            walletStatus.textContent = message;
            walletStatus.className = `wallet-status ${isError ? 'error' : 'connected'}`;
            walletStatus.style.display = 'block';
        }
    };

    const connectWallet = async () => {
        if (!checkMetaMaskInstalled()) {
            updateWalletStatus('Please install MetaMask to continue', true);
            return;
        }

        try {
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            userAccount = accounts[0];
            web3 = new Web3(window.ethereum);
            
            const truncatedAddress = `${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
            updateWalletStatus(`Connected: ${truncatedAddress}`);
            
            if (connectWalletBtn) {
                connectWalletBtn.textContent = 'Connected';
                connectWalletBtn.disabled = true;
            }

        } catch (error) {
            updateWalletStatus('Failed to connect wallet: ' + error.message, true);
        }
    };

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                userAccount = null;
                if (connectWalletBtn) {
                    connectWalletBtn.textContent = 'Login with Wallet';
                    connectWalletBtn.disabled = false;
                }
                updateWalletStatus('Wallet disconnected', true);
            } else {
                userAccount = accounts[0];
                const truncatedAddress = `${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
                updateWalletStatus(`Connected: ${truncatedAddress}`);
            }
        });

        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    }

    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWallet);
    }

    if (addEvidenceForm) {
        addEvidenceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!userAccount) {
                alert('Please connect your wallet first.');
                return;
            }

            const title = document.getElementById('evidenceTitle').value;
            const description = document.getElementById('evidenceDescription').value;
            const file = document.getElementById('evidenceFile').files[0];

            // Here you would typically upload the file to IPFS or another decentralized storage
            // and then store the metadata on the blockchain. For this example, we'll just
            // simulate the process.

            console.log('Evidence submitted:', { title, description, file: file.name });
            alert('Evidence submitted successfully!');
            addEvidenceForm.reset();
        });
    }

    if (evidenceList) {
        // Simulated evidence data
        const sampleEvidence = [
            { id: 1, title: 'Evidence Photo', description: 'Photograph of Evidence' },
            // { id: 2, title: 'Witness Statement', description: 'Written statement from key witness' },
            // { id: 3, title: 'Forensic Report', description: 'DNA analysis results' },
        ];

        sampleEvidence.forEach(evidence => {
            const evidenceItem = document.createElement('div');
            evidenceItem.className = 'evidence-item';
            evidenceItem.innerHTML = `
                <h2>${evidence.title}</h2>
                <p>${evidence.description}</p>
            `;
            evidenceList.appendChild(evidenceItem);
        });
    }
});

