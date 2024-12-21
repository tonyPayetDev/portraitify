import Replicate from "replicate";

const replicate = new Replicate({
  auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
});

export async function swapFace(sourceImage: string, targetImage: string): Promise<string> {
  try {
    const output = await replicate.run(
      "xiankgx/face-swap:cff87316e31787df12002c9e20a78a017a36cb31fde9862d8dedd15ab29b7288",
      {
        input: {
          local_source: sourceImage,
          local_target: targetImage
        }
      }
    );

    if (typeof output === 'object' && 'image' in output) {
      return output.image as string;
    }

    throw new Error('Invalid response format from Replicate API');
  } catch (error) {
    console.error('Error during face swap:', error);
    throw error;
  }
}
