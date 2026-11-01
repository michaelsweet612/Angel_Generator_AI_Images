#!/usr/bin/env python3
"""
Angel Generator AI - Desktop Window Studio v2.5
Native Windows 64-bit GUI with 4K Synthesis, High Thinking Reasoning, and Stop Control.
"""

import os
import sys
import time
import threading
from pathlib import Path
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
import customtkinter as ctk

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "src"))

from neural_engine import synthesize_angel_art, generate_high_thinking_analysis
from angel_generator import PRESETS

ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")


class AngelStudioApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Angel Generator AI — Desktop Studio (4K Ultra-HD & High Thinking)")
        self.geometry("1180x820")
        self.minsize(980, 720)

        self.is_generating = False
        self.cancel_event = threading.Event()
        self.current_pil_image = None
        self.last_seed = 777

        self.setup_ui()
        self.render_initial_preview()

    def setup_ui(self):
        # Configure Grid Layout
        self.grid_columnconfigure(0, weight=0, minsize=420)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # Left Controls Panel
        self.left_frame = ctk.CTkScrollableFrame(self, width=420, corner_radius=12, fg_color="#0e1322")
        self.left_frame.grid(row=0, column=0, sticky="nsew", padx=15, pady=15)

        # Header Title
        title_lbl = ctk.CTkLabel(
            self.left_frame,
            text="✦ ANGEL GENERATOR AI",
            font=ctk.CTkFont(family="Cinzel", size=20, weight="bold"),
            text_color="#f5c542"
        )
        title_lbl.pack(anchor="w", pady=(5, 2))

        sub_lbl = ctk.CTkLabel(
            self.left_frame,
            text="4K Ultra-HD & High Thinking Celestial Studio",
            font=ctk.CTkFont(size=12),
            text_color="#94a3b8"
        )
        sub_lbl.pack(anchor="w", pady=(0, 15))

        # Prompt Input
        ctk.CTkLabel(self.left_frame, text="PROMPT & CELESTIAL VISION", font=ctk.CTkFont(size=12, weight="bold"), text_color="#cbd5e1").pack(anchor="w", pady=(5, 3))
        self.prompt_txt = ctk.CTkTextbox(self.left_frame, height=85, corner_radius=8, fg_color="#182035", text_color="#ffffff")
        self.prompt_txt.insert("0.0", "Archangel Michael with massive glowing white feathered wings and golden halo in heavenly clouds, divine light rays, 4k masterpiece")
        self.prompt_txt.pack(fill="x", pady=(0, 10))

        # Preset Selector
        ctk.CTkLabel(self.left_frame, text="CURATED PRESETS", font=ctk.CTkFont(size=11, weight="bold"), text_color="#94a3b8").pack(anchor="w", pady=(0, 3))
        preset_names = [p["title"] for p in PRESETS]
        self.preset_combo = ctk.CTkComboBox(self.left_frame, values=preset_names, command=self.on_preset_selected, corner_radius=8, fg_color="#182035")
        self.preset_combo.set(preset_names[0])
        self.preset_combo.pack(fill="x", pady=(0, 12))

        # Style Selector
        ctk.CTkLabel(self.left_frame, text="ARTISTIC STYLE", font=ctk.CTkFont(size=11, weight="bold"), text_color="#94a3b8").pack(anchor="w", pady=(0, 3))
        self.style_combo = ctk.CTkComboBox(
            self.left_frame,
            values=["Renaissance Divine", "Golden Baroque", "Celestial Cosmic", "Cyberpunk Hologram", "Classic Ethereal"],
            corner_radius=8,
            fg_color="#182035"
        )
        self.style_combo.set("Renaissance Divine")
        self.style_combo.pack(fill="x", pady=(0, 12))

        # High Thinking Mode Toggle
        self.thinking_frame = ctk.CTkFrame(self.left_frame, corner_radius=8, fg_color="#1e1833", border_width=1, border_color="#7e22ce")
        self.thinking_frame.pack(fill="x", pady=(0, 12), ipady=4)
        
        self.high_thinking_var = ctk.BooleanVar(value=True)
        self.thinking_switch = ctk.CTkSwitch(
            self.thinking_frame,
            text="🧠 High Thinking Mode",
            variable=self.high_thinking_var,
            font=ctk.CTkFont(size=13, weight="bold"),
            progress_color="#f5c542",
            text_color="#f5c542"
        )
        self.thinking_switch.pack(anchor="w", padx=12, pady=(6, 2))
        ctk.CTkLabel(
            self.thinking_frame,
            text="Deep theological decomposition & compositional planning",
            font=ctk.CTkFont(size=11),
            text_color="#c084fc"
        ).pack(anchor="w", padx=12, pady=(0, 6))

        # Detail Level Slider
        detail_header_frame = ctk.CTkFrame(self.left_frame, fg_color="transparent")
        detail_header_frame.pack(fill="x", pady=(0, 2))
        ctk.CTkLabel(detail_header_frame, text="DETAIL LEVEL", font=ctk.CTkFont(size=11, weight="bold"), text_color="#94a3b8").pack(side="left")
        self.detail_badge = ctk.CTkLabel(detail_header_frame, text="Level 4 (Ultra Detail)", font=ctk.CTkFont(size=11, weight="bold"), text_color="#f5c542")
        self.detail_badge.pack(side="right")

        self.detail_slider = ctk.CTkSlider(self.left_frame, from_=1, to=5, number_of_steps=4, command=self.on_detail_slider, progress_color="#f5c542")
        self.detail_slider.set(4)
        self.detail_slider.pack(fill="x", pady=(0, 12))

        # Resolution Selector up to 4K
        ctk.CTkLabel(self.left_frame, text="RESOLUTION & QUALITY", font=ctk.CTkFont(size=11, weight="bold"), text_color="#94a3b8").pack(anchor="w", pady=(0, 3))
        self.res_combo = ctk.CTkComboBox(
            self.left_frame,
            values=[
                "512x512 (Draft)",
                "768x768 (Detailed)",
                "1024x1024 (HD Masterpiece)",
                "2048x2048 (2K Quad HD)",
                "3840x2160 (4K Widescreen UHD)",
                "4096x4096 (4K Ultra-HD Maximum)"
            ],
            corner_radius=8,
            fg_color="#182035"
        )
        self.res_combo.set("1024x1024 (HD Masterpiece)")
        self.res_combo.pack(fill="x", pady=(0, 15))

        # Action Buttons: Generate & Stop
        btn_frame = ctk.CTkFrame(self.left_frame, fg_color="transparent")
        btn_frame.pack(fill="x", pady=(0, 10))

        self.btn_generate = ctk.CTkButton(
            btn_frame,
            text="✦ GENERATE",
            command=self.start_generation,
            font=ctk.CTkFont(size=14, weight="bold"),
            fg_color="#f5c542",
            hover_color="#e6a715",
            text_color="#070913",
            height=42,
            corner_radius=8
        )
        self.btn_generate.pack(side="left", fill="x", expand=True, padx=(0, 6))

        self.btn_stop = ctk.CTkButton(
            btn_frame,
            text="⏹ STOP",
            command=self.stop_generation,
            font=ctk.CTkFont(size=13, weight="bold"),
            fg_color="#7f1d1d",
            hover_color="#991b1b",
            text_color="#fca5a5",
            height=42,
            width=100,
            corner_radius=8,
            state="disabled"
        )
        self.btn_stop.pack(side="right", padx=(6, 0))

        # Progress Bar & Time Remaining
        self.progress_frame = ctk.CTkFrame(self.left_frame, corner_radius=8, fg_color="#12182b")
        self.progress_frame.pack(fill="x", pady=(0, 10), ipady=4)

        self.progress_bar = ctk.CTkProgressBar(self.progress_frame, progress_color="#f5c542")
        self.progress_bar.set(0.0)
        self.progress_bar.pack(fill="x", padx=10, pady=(6, 4))

        meta_frame = ctk.CTkFrame(self.progress_frame, fg_color="transparent")
        meta_frame.pack(fill="x", padx=10, pady=(0, 6))
        self.progress_status_lbl = ctk.CTkLabel(meta_frame, text="Ready for 4K Synthesis", font=ctk.CTkFont(size=11), text_color="#cbd5e1")
        self.progress_status_lbl.pack(side="left")
        self.time_rem_lbl = ctk.CTkLabel(meta_frame, text="", font=ctk.CTkFont(size=11, weight="bold"), text_color="#38bdf8")
        self.time_rem_lbl.pack(side="right")

        # Right / Center Display Panel
        self.right_frame = ctk.CTkFrame(self, corner_radius=12, fg_color="#080c18")
        self.right_frame.grid(row=0, column=1, sticky="nsew", padx=(0, 15), pady=15)
        self.right_frame.grid_rowconfigure(0, weight=1)
        self.right_frame.grid_rowconfigure(1, weight=0)
        self.right_frame.grid_columnconfigure(0, weight=1)

        # Image Canvas
        self.canvas_frame = ctk.CTkFrame(self.right_frame, fg_color="#04060c", corner_radius=8)
        self.canvas_frame.grid(row=0, column=0, sticky="nsew", padx=15, pady=(15, 10))

        self.image_label = ctk.CTkLabel(self.canvas_frame, text="")
        self.image_label.pack(expand=True, fill="both", padx=10, pady=10)

        # Bottom Bar: High Thinking Log & Save Button
        bottom_frame = ctk.CTkFrame(self.right_frame, fg_color="#0e1322", corner_radius=8)
        bottom_frame.grid(row=1, column=0, sticky="ew", padx=15, pady=(0, 15))

        self.thinking_log_txt = ctk.CTkTextbox(bottom_frame, height=90, fg_color="#050811", text_color="#94a3b8", font=ctk.CTkFont(family="Consolas", size=11))
        self.thinking_log_txt.pack(side="left", fill="both", expand=True, padx=10, pady=10)
        self.thinking_log_txt.insert("0.0", "🧠 High Thinking Reasoning Log:\nReady to decompose prompt into theological archetypes and 4K micro-geometry.")

        btn_save = ctk.CTkButton(
            bottom_frame,
            text="⬇ SAVE IMAGE",
            command=self.save_image,
            font=ctk.CTkFont(size=13, weight="bold"),
            fg_color="#1e293b",
            hover_color="#334155",
            text_color="#f5c542",
            height=40,
            width=130
        )
        btn_save.pack(side="right", padx=10, pady=10)

    def on_preset_selected(self, choice):
        for p in PRESETS:
            if p["title"] == choice:
                self.prompt_txt.delete("0.0", "end")
                self.prompt_txt.insert("0.0", p["prompt"])
                style_map = {
                    "renaissance": "Renaissance Divine",
                    "divine_gold": "Golden Baroque",
                    "celestial": "Celestial Cosmic",
                    "cyberpunk": "Cyberpunk Hologram",
                    "default": "Classic Ethereal"
                }
                self.style_combo.set(style_map.get(p["style"], "Renaissance Divine"))
                break

    def on_detail_slider(self, val):
        val = int(val)
        labels = {
            1: "Level 1 (Fast Draft)",
            2: "Level 2 (Normal)",
            3: "Level 3 (Balanced)",
            4: "Level 4 (Ultra Detail)",
            5: "Level 5 (4K Masterpiece)"
        }
        self.detail_badge.configure(text=labels.get(val, f"Level {val}"))

    def render_initial_preview(self):
        try:
            img = synthesize_angel_art(
                "Archangel with glowing wings",
                width=512,
                height=512,
                seed=777,
                style="renaissance",
                detail_level=3
            )
            self.display_image(img)
        except Exception as e:
            print("Preview init error:", e)

    def display_image(self, img: Image.Image):
        self.current_pil_image = img
        display_w = max(380, min(self.canvas_frame.winfo_width() - 30, 680))
        display_h = max(380, min(self.canvas_frame.winfo_height() - 30, 680))
        
        resized = img.copy()
        resized.thumbnail((display_w, display_h), Image.Resampling.LANCZOS)
        
        ctk_img = ctk.CTkImage(light_image=resized, dark_image=resized, size=resized.size)
        self.image_label.configure(image=ctk_img)

    def start_generation(self):
        if self.is_generating:
            return

        self.is_generating = True
        self.cancel_event.clear()
        self.btn_generate.configure(state="disabled")
        self.btn_stop.configure(state="normal")

        prompt = self.prompt_txt.get("0.0", "end").strip()
        style_raw = self.style_combo.get().lower()
        style_key = "renaissance"
        if "gold" in style_raw: style_key = "divine_gold"
        elif "cosmic" in style_raw: style_key = "celestial"
        elif "cyber" in style_raw: style_key = "cyberpunk"
        elif "classic" in style_raw: style_key = "default"

        res_str = self.res_combo.get().split()[0]
        w, h = map(int, res_str.split("x"))
        detail_level = int(self.detail_slider.get())
        high_thinking = self.high_thinking_var.get()

        # Update Thinking Log
        if high_thinking:
            thoughts = generate_high_thinking_analysis(prompt, style_key, detail_level, w, h)
            self.thinking_log_txt.delete("0.0", "end")
            self.thinking_log_txt.insert("0.0", "🧠 High Thinking Reasoning Process:\n" + "\n".join(thoughts))

        # Launch Worker Thread
        thread = threading.Thread(
            target=self.generation_worker,
            args=(prompt, w, h, style_key, detail_level, high_thinking),
            daemon=True
        )
        thread.start()

    def stop_generation(self):
        if not self.is_generating:
            return
        self.cancel_event.set()
        self.progress_status_lbl.configure(text="Stopping generation...")
        self.time_rem_lbl.configure(text="Halted")

    def generation_worker(self, prompt, w, h, style, detail_level, high_thinking):
        t0 = time.time()
        seed = int(time.time() * 1000) % 999999
        self.last_seed = seed

        def on_progress(pct, msg, rem_sec):
            self.after(0, lambda: self.update_progress_ui(pct, msg, rem_sec))

        try:
            img = synthesize_angel_art(
                prompt=prompt,
                width=w,
                height=h,
                seed=seed,
                style=style,
                detail_level=detail_level,
                high_thinking=high_thinking,
                progress_callback=on_progress,
                cancel_check=lambda: self.cancel_event.is_set()
            )

            # Auto-save into outputs directory
            out_dir = BASE_DIR / "outputs"
            out_dir.mkdir(parents=True, exist_ok=True)
            out_file = out_dir / f"angel_{int(time.time())}_{seed}.png"
            img.save(str(out_file))

            elapsed = round(time.time() - t0, 2)
            self.after(0, lambda: self.on_generation_success(img, elapsed, w, h, seed))

        except InterruptedError:
            self.after(0, lambda: self.on_generation_cancelled())
        except Exception as e:
            self.after(0, lambda: messagebox.showerror("Generation Error", str(e)))
        finally:
            self.after(0, self.reset_buttons)

    def update_progress_ui(self, pct, msg, rem_sec):
        self.progress_bar.set(pct)
        self.progress_status_lbl.configure(text=msg)
        if rem_sec > 0:
            self.time_rem_lbl.configure(text=f"~{rem_sec:.1f}s left")
        else:
            self.time_rem_lbl.configure(text="")

    def on_generation_success(self, img, elapsed, w, h, seed):
        self.display_image(img)
        self.progress_bar.set(1.0)
        self.progress_status_lbl.configure(text=f"Completed in {elapsed}s ({w}x{h}, Seed: {seed})")
        self.time_rem_lbl.configure(text="Done")

    def on_generation_cancelled(self):
        self.progress_status_lbl.configure(text="Generation stopped by user.")
        self.time_rem_lbl.configure(text="Stopped")
        self.progress_bar.set(1.0)

    def reset_buttons(self):
        self.is_generating = False
        self.btn_generate.configure(state="normal")
        self.btn_stop.configure(state="disabled")

    def save_image(self):
        if not self.current_pil_image:
            messagebox.showinfo("No Image", "Generate an image first before saving.")
            return

        file_path = filedialog.asksaveasfilename(
            defaultextension=".png",
            filetypes=[("PNG Image", "*.png"), ("JPEG Image", "*.jpg"), ("BMP Image", "*.bmp")],
            initialfile=f"angel_art_{self.last_seed}.png"
        )
        if file_path:
            self.current_pil_image.save(file_path)
            messagebox.showinfo("Saved", f"Image saved successfully to:\n{file_path}")


def main():
    app = AngelStudioApp()
    app.mainloop()


if __name__ == "__main__":
    main()
