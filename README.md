[<img src="https://faithfultweaks.com/images/logo.png" alt="Faithful Tweaks Logo" width="150px" />](https://faithfultweaks.com/)

# Faithful Tweaks Bedrock
<p>
    <a href="https://github.com/FaithfulTweaks/FaithfulTweaksBedrock/actions"><img alt="Website Deploy" src="https://github.com/FaithfulTweaks/FaithfulTweaksBedrock/workflows/Website%20Deploy/badge.svg"></a>
    <a href="https://github.com/FaithfulTweaks/FaithfulTweaksBedrock/actions"><img alt="Functions Deploy" src="https://github.com/FaithfulTweaks/FaithfulTweaksBedrock/workflows/Functions%20Deploy/badge.svg"></a>
    <a href="https://github.com/FaithfulTweaks/FaithfulTweaksBedrock/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/FaithfulTweaks/FaithfulTweaksBedrock"></a>
    <a href="https://github.com/FaithfulTweaks/FaithfulTweaksBedrock/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/FaithfulTweaks/FaithfulTweaksBedrock"></a>
    <a href="https://github.com/FaithfulTweaks/FaithfulTweaksBedrock/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/FaithfulTweaks/FaithfulTweaksBedrock"></a>
    <a href="https://github.com/FaithfulTweaks/FaithfulTweaksBedrock/blob/master/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/FaithfulTweaks/FaithfulTweaksBedrock"></a>
</p>

A fork of [Faithful Tweaks](https://github.com/FaithfulTweaks/FaithfulTweaks/) built for the Bedrock Edition of [Minecraft](https://minecraft.net/).

## Creating Modules
If you're interested in creating a module, please look at [the wiki](https://github.com/FaithfulTweaks/FaithfulTweaksBedrock/wiki).

Notice: Icon/HUD modules and menu panorama modules are not implemented in the traditional fashion.

## Making requests to the Cloud Function
Example body of POST request:
```json
{
    "modules":  ["SlicedSwords", "ReducedPumpkinBlur", "ColoredBows", "OreBorders", "StickyPistonSides"],
    "iconModules": ["MelonHunger", "ColoredPing", "BlueWitherHearts", "RainbowXP"],
    "panoOption": "ClassicPano"
}
```

Example response from POST request:
```json
{
    "url": "https://firebasestorage.googleapis.com/v0/b/faithfultweaks-bedrock.appspot.com/o/FaithfulTweaks%2F900000000-0000-0000-0000-000000000000.zip?alt=media&token=00000000-0000-0000-0000-000000000000"
}
```

## Credits
⚠ **NOTE** We try to give credit to those that created the textures but we're not great at keeping track. If you believe some textures are yours please contact us and we'll add you to this list (or take your textures down upon request).
- [Banakin](https://banakin.github.io): Making the website and various tweaks
- [The Faithful Team](https://faithful.team/): Making the Faithful Texture Pack
- [Vanilla Tweaks](https://vanillatweaks.net/picker/resource-packs/): Inspiration

## Tech Used
- [Firebase](https://firebase.google.com/) - Backend (API, Hosting, Storage)
- [node.js](https://nodejs.org/) - Used for the API
- [Canvas](https://github.com/Automattic/node-canvas) - Combining images
- [Archiver](https://github.com/archiverjs/node-archiver) - Creating the ZIP file
- [Hugo](https://gohugo.io/) - Website framework
- [Webpack](https://webpack.js.org/) - Bundler
- [Bootstrap](https://getbootstrap.com/) - CSS framework for the website
- [jQuery](https://jquery.com/) - JavaScript Framework for the website
- [Popper](https://popper.js.org/) - Engine for description popups
- [Font Awesome](https://fontawesome.com/) - Icons used on the website
