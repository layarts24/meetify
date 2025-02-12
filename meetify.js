class Meetify {
  constructor() {
    this.peers = new Map();
    this.localStream = null;
    this.roomId = this.generateRoomId();
    this.initializeElements();
    this.attachEventListeners();
    this.startMeeting();
  }

  initializeElements() {
    this.videoGrid = document.getElementById('videoGrid');
    this.muteBtn = document.getElementById('muteBtn');
    this.videoBtn = document.getElementById('videoBtn');
    this.leaveBtn = document.getElementById('leaveBtn');
    this.shareBtn = document.getElementById('shareBtn');
    this.shareModal = document.getElementById('shareModal');
    this.closeModal = document.getElementById('closeModal');
    this.copyBtn = document.getElementById('copyBtn');
    this.roomIdDisplay = document.getElementById('roomId');
    this.roomCodeDisplay = document.getElementById('roomCode');
    
    this.roomIdDisplay.textContent = `Room: ${this.roomId}`;
    this.roomCodeDisplay.textContent = this.roomId;
    this.generateQRCode();
  }

  attachEventListeners() {
    this.muteBtn.addEventListener('click', () => this.toggleAudio());
    this.videoBtn.addEventListener('click', () => this.toggleVideo());
    this.leaveBtn.addEventListener('click', () => this.leaveMeeting());
    this.shareBtn.addEventListener('click', () => this.showShareModal());
    this.closeModal.addEventListener('click', () => this.hideShareModal());
    this.copyBtn.addEventListener('click', () => this.copyRoomLink());
  }

  async startMeeting() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      this.addVideoStream(this.localStream, 'You');
      this.setupWebRTC();
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }

  setupWebRTC() {
    // This would connect to a signaling server and handle WebRTC connections
    // Simplified for demonstration
    console.log('WebRTC setup would happen here');
  }

  addVideoStream(stream, username) {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    if (username === 'You') video.muted = true;

    videoContainer.appendChild(video);
    this.videoGrid.appendChild(videoContainer);
  }

  toggleAudio() {
    const enabled = this.localStream.getAudioTracks()[0].enabled;
    this.localStream.getAudioTracks()[0].enabled = !enabled;
    this.muteBtn.classList.toggle('active');
  }

  toggleVideo() {
    const enabled = this.localStream.getVideoTracks()[0].enabled;
    this.localStream.getVideoTracks()[0].enabled = !enabled;
    this.videoBtn.classList.toggle('active');
  }

  leaveMeeting() {
    this.localStream.getTracks().forEach(track => track.stop());
    window.location.href = '/';
  }

  generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  generateQRCode() {
    const qr = qrcode(0, 'M');
    const meetingUrl = `${window.location.origin}?room=${this.roomId}`;
    qr.addData(meetingUrl);
    qr.make();
    document.getElementById('qrCode').innerHTML = qr.createImgTag(5);
  }

  showShareModal() {
    this.shareModal.style.display = 'flex';
  }

  hideShareModal() {
    this.shareModal.style.display = 'none';
  }

  copyRoomLink() {
    const meetingUrl = `${window.location.origin}?room=${this.roomId}`;
    navigator.clipboard.writeText(meetingUrl);
    this.copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      this.copyBtn.textContent = 'Copy Link';
    }, 2000);
  }
}

// Initialize the app
new Meetify();