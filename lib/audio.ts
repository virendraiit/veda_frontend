import { GoogleGenAI, type LiveServerMessage, MediaResolution, Modality, type Session } from "@google/genai"

interface AudioGenerationOptions {
  voiceName?: string
  responseModalities?: string[]
  mediaResolution?: string
}

export class AudioGenerator {
  private ai: GoogleGenAI
  private session: Session | undefined
  private responseQueue: LiveServerMessage[] = []
  private audioParts: string[] = []

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyAsVkN0ygVBsl2tVAN_Dq5E0AY5aabyrqA",
    })
  }

  async generateAudio(text: string, options: AudioGenerationOptions = {}): Promise<string> {
    try {
      const model = "models/gemini-2.5-flash-preview-native-audio-dialog"
      const config = {
        responseModalities: [Modality.AUDIO],
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: options.voiceName || "Zephyr",
            },
          },
        },
        contextWindowCompression: {
          triggerTokens: "25600",
          slidingWindow: { targetTokens: "12800" },
        },
      }

      this.session = await this.ai.live.connect({
        model,
        callbacks: {
          onopen: () => {
            console.debug("Audio session opened")
          },
          onmessage: (message: LiveServerMessage) => {
            this.responseQueue.push(message)
          },
          onerror: (e: ErrorEvent) => {
            console.error("Audio session error:", e.message)
          },
          onclose: (e: CloseEvent) => {
            console.debug("Audio session closed:", e.reason)
          },
        },
        config,
      })

      this.session.sendClientContent({
        turns: [text],
      })

      await this.handleTurn()
      this.session.close()

      // Convert audio parts to a single audio file
      if (this.audioParts.length > 0) {
        return this.convertToAudioUrl()
      }

      throw new Error("No audio generated")
    } catch (error) {
      console.error("Error generating audio:", error)
      throw error
    }
  }

  private async handleTurn(): Promise<LiveServerMessage[]> {
    const turn: LiveServerMessage[] = []
    let done = false

    while (!done) {
      const message = await this.waitMessage()
      turn.push(message)
      if (message.serverContent && message.serverContent.turnComplete) {
        done = true
      }
    }

    return turn
  }

  private async waitMessage(): Promise<LiveServerMessage> {
    let done = false
    let message: LiveServerMessage | undefined = undefined

    while (!done) {
      message = this.responseQueue.shift()
      if (message) {
        this.handleModelTurn(message)
        done = true
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    return message!
  }

  private handleModelTurn(message: LiveServerMessage) {
    if (message.serverContent?.modelTurn?.parts) {
      const part = message.serverContent.modelTurn.parts[0]

      if (part?.fileData) {
        console.log(`Audio file: ${part.fileData.fileUri}`)
      }

      if (part?.inlineData) {
        this.audioParts.push(part.inlineData.data ?? "")
      }

      if (part?.text) {
        console.log("Audio text:", part.text)
      }
    }
  }

  private convertToAudioUrl(): string {
    if (this.audioParts.length === 0) {
      throw new Error("No audio data to convert")
    }

    // Combine all audio parts
    const combinedAudio = this.audioParts.join("")
    const buffer = Buffer.from(combinedAudio, "base64")

    // Create a blob URL for the audio
    const blob = new Blob([buffer], { type: "audio/wav" })
    return URL.createObjectURL(blob)
  }

  private convertToWav(rawData: string[], mimeType: string): Buffer {
    const options = this.parseMimeType(mimeType)
    const dataLength = rawData.reduce((a, b) => a + b.length, 0)
    const wavHeader = this.createWavHeader(dataLength, options)
    const buffer = Buffer.concat(rawData.map((data) => Buffer.from(data, "base64")))
    return Buffer.concat([wavHeader, buffer])
  }

  private parseMimeType(mimeType: string) {
    const [fileType, ...params] = mimeType.split(";").map((s) => s.trim())
    const [_, format] = fileType.split("/")
    const options: any = {
      numChannels: 1,
      bitsPerSample: 16,
    }

    if (format && format.startsWith("L")) {
      const bits = Number.parseInt(format.slice(1), 10)
      if (!Number.isNaN(bits)) {
        options.bitsPerSample = bits
      }
    }

    for (const param of params) {
      const [key, value] = param.split("=").map((s) => s.trim())
      if (key === "rate") {
        options.sampleRate = Number.parseInt(value, 10)
      }
    }

    return options
  }

  private createWavHeader(dataLength: number, options: any): Buffer {
    const { numChannels, sampleRate, bitsPerSample } = options
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8
    const blockAlign = (numChannels * bitsPerSample) / 8
    const buffer = Buffer.alloc(44)

    buffer.write("RIFF", 0)
    buffer.writeUInt32LE(36 + dataLength, 4)
    buffer.write("WAVE", 8)
    buffer.write("fmt ", 12)
    buffer.writeUInt32LE(16, 16)
    buffer.writeUInt16LE(1, 20)
    buffer.writeUInt16LE(numChannels, 22)
    buffer.writeUInt32LE(sampleRate, 24)
    buffer.writeUInt32LE(byteRate, 28)
    buffer.writeUInt16LE(blockAlign, 32)
    buffer.writeUInt16LE(bitsPerSample, 34)
    buffer.write("data", 36)
    buffer.writeUInt32LE(dataLength, 40)

    return buffer
  }
}

// Simplified audio generation function
export async function generateAudio(text: string, voiceName = "Zephyr"): Promise<string> {
  const generator = new AudioGenerator()
  return await generator.generateAudio(text, { voiceName })
}

// Text-to-speech for educational content
export async function generateEducationalAudio(
  content: string,
  language = "english",
  voiceName = "Zephyr",
): Promise<string> {
  const enhancedContent = `
    Please read this educational content clearly and with appropriate pacing for students:
    
    ${content}
    
    Use a friendly, educational tone suitable for learning.
  `

  return await generateAudio(enhancedContent, voiceName)
}
