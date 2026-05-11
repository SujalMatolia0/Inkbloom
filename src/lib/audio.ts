"use client";

import { Howl } from "howler";

class AudioController {
  private sound: Howl | null = null;
  private isPlaying: boolean = false;
  private hasInteracted: boolean = false;
  private playIntent: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.sound = new Howl({
        // TODO: Replace with self-hosted royalty-free jazz track in /public/audio/gallery-jazz.mp3
        src: ["https://cdn.pixabay.com/download/audio/2022/03/07/audio_4044c330f4.mp3?filename=lofi-jazz-hip-hop-10511.mp3"], // Updated to Pixabay CDN (more reliable)
        loop: true,
        volume: 0.3,
        autoplay: false,
        onload: () => console.log("Audio Loaded Successfully"),
        onloaderror: (id, error) => {
          console.warn("Audio Load Error (Non-Fatal):", error);
          // Don't crash the app, just disable audio functionality
          this.sound = null;
        },
      });

      const handleInteraction = () => {
        if (!this.hasInteracted) {
          this.hasInteracted = true;
          window.removeEventListener("click", handleInteraction);
          window.removeEventListener("keydown", handleInteraction);
          
          if (this.playIntent) {
            this.play();
          }
        }
      };

      window.addEventListener("click", handleInteraction);
      window.addEventListener("keydown", handleInteraction);
    }
  }

  play() {
    if (this.sound && !this.isPlaying && this.hasInteracted) {
      this.sound.play();
      this.isPlaying = true;
      this.playIntent = true;
    }
  }

  playWhenReady() {
    this.playIntent = true;
    if (this.hasInteracted) {
      this.play();
    }
  }

  pause() {
    if (this.sound && this.isPlaying) {
      this.sound.pause();
      this.isPlaying = false;
      this.playIntent = false;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      if (this.hasInteracted) {
        this.play();
      } else {
        this.playWhenReady();
      }
    }
    return this.isPlaying;
  }

  setVolume(val: number) {
    if (this.sound) {
      this.sound.volume(val);
    }
  }

  getStatus() {
    return this.isPlaying;
  }
}

export const audioController = typeof window !== "undefined" ? new AudioController() : null;
