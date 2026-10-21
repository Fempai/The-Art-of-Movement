# Licensed character demo and validation status

## Character source
The optional **Michelle** character is a third-party rigged humanoid GLB from [three-ws/avatars](https://huggingface.co/three-ws/avatars), whose repository declares the **MIT license**. The model is fetched on demand from `https://huggingface.co/three-ws/avatars/resolve/main/michelle.glb`; the Academy does not bundle or redistribute its bytes. The original rigged character includes a SambaDance clip, useful for checking whether the GPU renderer can display an animated character.

The Michelle model is **not a bespoke likeness** of the Academy owner. It is a licensed third-party example, not a newly commissioned or professionally customized avatar. Verify the upstream asset's provenance and license for any commercial use beyond this prototype.

## Two independent animation paths
1. **Native sample animation**: Load licensed Michelle character → Preview built-in dance. This plays the source GLB animation and can be used to visually inspect the model and rendering.
2. **Pose Lab retargeting**: Load licensed Michelle character → choose local Pose Lab JSON with opt-in 3D world landmarks → Play. The skeleton adapter maps common humanoid bones, rejects inadequate coverage, and applies confidence-gated estimated pose rotations. This is not a validated choreography reconstruction.

## Device validation (not completed)
The Academy's GitHub Actions browser regression includes a mobile viewport screenshot test, but this does not prove correct real-device rendering. **Samsung phone validation requires an actual device test by the owner**. On the Samsung:
1. Open `https://fempai.github.io/The-Art-of-Movement/skinned-avatar-studio.html`.
2. Select **Load licensed Michelle character**; check whether it renders, including textures and hands.
3. Select **Preview built-in dance**; check knees, feet, shoulders, lighting, smoothness and camera rotation.
4. Load a real Pose Lab recording with 3D joints, press Play, compare with the actual recorded dance, and note joint inversion, foot sliding, lag, freezing, or model deformation.
5. Report phone/browser model, any errors, and a short screen recording for review. Do not interpret the native sample animation as proof that Pose Lab retargeting is accurate.

**Status:** asset source integrated, automated tests added, but real-device and human visual acceptance not yet verified.
