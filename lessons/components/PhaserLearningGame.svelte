<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Phaser from 'phaser';

  type Props = {
    title: string;
    story: string;
    prompt: string;
    options: string[];
    correctAnswerIndex: number;
    onScore?: (points: number) => void;
  };

  let { title, story, prompt, options, correctAnswerIndex, onScore }: Props = $props();
  let canvasHost: HTMLDivElement | undefined;
  let game: Phaser.Game | null = null;
  let selectedAnswer = $state<number | null>(null);
  let feedback = $state("Choose the best answer to keep moving.");

  function chooseAnswer(index: number) {
    if (selectedAnswer !== null) return;
    selectedAnswer = index;
    const correct = index === correctAnswerIndex;
    feedback = correct ? "Correct — mastery bonus awarded." : "Attempt recorded — participation points awarded.";
    onScore?.(correct ? 25 : 10);
    setTimeout(() => {
      selectedAnswer = null;
      feedback = "Choose the best answer to keep moving.";
    }, 900);
  }

  onMount(() => {
    if (!canvasHost) return;
    const scene = {
      create: function (this: any) {
        this.add.text(320, 34, title, {
          fontFamily: "Arial",
          fontSize: "24px",
          color: "#ffffff",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: 580 }
        }).setOrigin(0.5);
        this.add.text(320, 76, story, {
          fontFamily: "Arial",
          fontSize: "14px",
          color: "#93c5fd",
          align: "center",
          wordWrap: { width: 560 }
        }).setOrigin(0.5);
        this.add.text(320, 128, prompt, {
          fontFamily: "Arial",
          fontSize: "18px",
          color: "#f8fafc",
          align: "center",
          wordWrap: { width: 560 }
        }).setOrigin(0.5);

        options.forEach((option, index) => {
          const y = 184 + index * 42;
          const rect = this.add.rectangle(320, y, 540, 30, selectedAnswer === index ? 0x2563eb : 0x1e293b)
            .setStrokeStyle(1, selectedAnswer === index ? 0x60a5fa : 0x334155)
            .setInteractive({ useHandCursor: true });
          const label = this.add.text(320, y, option, {
            fontFamily: "Arial",
            fontSize: "15px",
            color: selectedAnswer === index ? "#ffffff" : "#cbd5e1",
            align: "center"
          }).setOrigin(0.5);
          this.input.on("gameobjectdown", (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            if (gameObject === rect || gameObject === label) chooseAnswer(index);
          });
        });

        this.add.text(320, 326, feedback, {
          fontFamily: "Arial",
          fontSize: "13px",
          color: "#fbbf24",
          align: "center"
        }).setOrigin(0.5);
      }
    };

    game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: canvasHost,
      width: 640,
      height: 360,
      backgroundColor: "#020617",
      scene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    });
  });

  onDestroy(() => {
    game?.destroy(true);
    game = null;
  });
</script>

<div class="frosted-glass rounded-3xl border border-blue-950 p-4 space-y-4">
  <div class="text-center space-y-1">
    <p class="text-[10px] uppercase tracking-widest text-blue-400 font-mono font-bold">Phaser Lesson Component</p>
    <h3 class="text-sm font-extrabold text-white uppercase">{title}</h3>
  </div>
  <div bind:this={canvasHost} class="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"></div>
</div>
