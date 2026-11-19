export interface LocketFilterPreset {
  id: string;
  category: string;
  label: string;
  iconUrl?: string;
  promptInstruction: string;
}

export const OFFICIAL_LOCKET_FILTERS: LocketFilterPreset[] = [
  {
    "id": "none",
    "category": "Mặc định",
    "label": "Không dùng Filter Locket",
    "promptInstruction": ""
  },
  {
    "id": "practical_magic_2",
    "category": "Events",
    "label": "Practical Magic 2",
    "iconUrl": "https://storage.googleapis.com/locket-public/camera_filters/icons/pm2_cutout.png",
    "promptInstruction": "Preserve the original photo and background. Add lush, deep green vines and subtle flowers throughout the environment, with some vines reaching toward and around the user to create a magical, interactive feeling. Add 1–2 soft roses in the background, mixing white and pink. Include small and subtle glowing fireflies for warmth and atmosphere, but keep them small, dim, sparse, and understated. Keep the overall look dreamy, natural, and slightly enchanted, without turning the setting into a full greenhouse."
  },
  {
    "id": "looks_maxxing",
    "category": "Goofy",
    "label": "Looks-Maxxing",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/looksmaxing.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with a hyperbolically chiseled jawline and strongly emphasized cheekbones for an exaggerated, \\\"looksmaxxed\\\" appearance.\\n\\nSharpen the jawline significantly, creating very crisp, angular edges along the mandibular line with a pronounced, squared jaw angle. The chin should appear more prominent and sculpted, with a defined, forward structure and clean lower contour. Despite the exaggeration, the overall head size and silhouette must remain unchanged, with no outward expansion or distortion of the skull shape.\\n\\nEnhance the cheekbones by increasing their prominence and height, adding clear structure beneath the eyes and tapering into the jawline. Introduce stronger but still realistic shadowing beneath the cheekbones and along the jaw to create depth and contrast, with smooth gradients that follow the original lighting direction. Slightly reduce mid-face softness to emphasize bone structure, but preserve natural skin texture and avoid over-smoothing.\\n\\nAll enhancements should remain anatomically coherent and integrated with the person's original features, maintaining identity and expression. Ensure lighting, color, and shadow behavior match the scene exactly, with highlights and contours reinforcing the new structure without introducing artificial artifacts.\\n\\nDo not alter the person's face beyond bone structure definition, and do not change pose, background, framing, depth of field, or image quality. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "influencer",
    "category": "Goofy",
    "label": "Influencer",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/influencer.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with a hyperbolic \\\"influencer\\\" makeup look applied to the face, captured with a modern iPhone camera look.\\n\\nEnhance the eyebrows so they appear highly sculpted and precisely shaped, with sharp definition and fuller density while preserving the original eyebrow placement and bone structure. The brows should have clean edges, slightly darker pigment, and visible individual hair strokes so they look groomed rather than painted.\\n\\nAdd long, dramatic fake eyelashes that extend outward and upward from the natural lash line. The lashes should appear thick and layered with subtle tapering at the ends, curving naturally with the eyelid and casting faint shadows onto the upper cheek area.\\n\\nEnhance the lips with a glossy finish and visibly enlarged lip volume, resembling cosmetic lip injections. The lips should appear fuller and more plump while maintaining the person's original lip shape and proportions. Add natural specular highlights and reflective gloss texture across the surface to create a shiny appearance, with slight light reflections consistent with the scene.\\n\\nAll enhancements should remain confined strictly to the facial features. Do not alter the overall head size, face shape, or identity. Preserve natural skin texture, pores, and lighting so the makeup integrates realistically with the environment.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp facial detail, balanced highlights and shadows, and slightly vibrant but realistic colors. The enhancements should inherit this same processing so they feel captured in-camera.\\n\\nKeep the background, pose, framing, depth of field, and image quality exactly the same. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "toothless",
    "category": "Goofy",
    "label": "Toothless",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/toothless.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with one front tooth missing, captured with a modern iPhone camera look.\\n\\nIf the subject's teeth are already visible, remove one of the upper central front teeth (typically one of the two front incisors) so there is a clearly visible gap. If the subject is not already smiling with visible teeth, adjust only the mouth expression to a natural, slight smile that reveals the teeth, ensuring the missing front tooth is clearly visible. Do not alter the rest of the facial expression or facial structure beyond what is necessary to reveal the teeth.\\n\\nThe gap should look natural, with realistic gum detail and subtle shadowing inside the mouth. Surrounding teeth should remain unchanged in shape, color, and alignment. Maintain proper lighting inside the mouth so the result feels physically accurate and not artificially edited.\\n\\nPreserve the subject's identity, face shape, and proportions exactly. Do not enlarge or distort the mouth or head. Keep skin texture, lips, and surrounding features consistent with the original image.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and true-to-life but slightly vibrant colors.\\n\\nKeep the background, pose, framing, depth of field, and image quality exactly the same, with the missing tooth appearing as a natural, in-camera detail. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "okay_wig",
    "category": "Goofy",
    "label": "Okay Wig",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/orange_wig.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with a realistic orange bob wig worn naturally on the head. The wig should be a vibrant but natural-looking orange tone (not overly saturated), with a clean, chin-length bob cut that curves slightly inward at the ends. Include soft layering and subtle strand variation so the hair does not appear flat or artificial.\\n\\nThe wig should sit convincingly along the scalp, aligning precisely with the existing hairline without changing its shape or position. Allow a few natural flyaways and slight irregularities to enhance realism. The hair should follow gravity and the person's head position, with gentle volume and curvature consistent with a real styled bob.\\n\\nEnsure the wig integrates seamlessly with the scene's lighting, showing appropriate highlights, lowlights, and soft shadows between strands. If applicable, include subtle shadowing where the wig meets the forehead and sides of the face. Do not alter the person's face, expression, skin tone, or any visible facial features. Keep the background, pose, framing, depth of field, and image quality exactly the same. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "bye_brows",
    "category": "Looks",
    "label": "Bye Brows",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/bye_brows.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with only the eyebrow hair removed.\\n\\nRemove all visible eyebrow hair strictly within the natural eyebrow region, without altering any surrounding areas. The shape, size, and silhouette of the head must remain exactly the same. Do not modify or remove any hair on the scalp, hairline, eyelashes, or facial hair outside of the eyebrows.\\n\\nPreserve the natural brow ridge and skin beneath, showing realistic skin texture with fine pores and subtle tonal variation where the eyebrows were. Avoid overly smooth or blurred skin. Include very faint follicle shading or slight discoloration to maintain realism, but no visible hairs.\\n\\nEnsure lighting, shadows, and color match the original image exactly, with no new shading that would imply structural changes. Do not alter facial proportions, expression, or identity in any way.\\n\\nKeep the background, pose, framing, depth of field, and image quality identical to the original, with the only change being the absence of eyebrow hair. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "braces",
    "category": "Looks",
    "label": "Braces",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/braces.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with multicolored braces visible on their teeth, captured with a modern iPhone camera look.\\n\\nIf the subject's teeth are already visible, add orthodontic braces to the upper teeth (and lower teeth if visible). The braces should include small metallic brackets bonded to each tooth, connected by a thin archwire. Each bracket should have colored elastic bands in a variety of hues (such as red, blue, green, yellow, purple), arranged in a mixed, non-uniform pattern for a playful look.\\n\\nIf the subject is not already smiling with visible teeth, adjust only the mouth expression to a natural, slight smile that reveals the teeth so the braces are clearly visible. Do not alter the rest of the facial expression or facial structure beyond what is necessary to reveal the teeth.\\n\\nEnsure the braces integrate realistically with the teeth, with proper reflections on the metal brackets and subtle translucency in the colored bands. Lighting inside the mouth should remain consistent with the scene, with natural shadowing and highlights.\\n\\nPreserve the subject's identity, face shape, and proportions exactly. Do not enlarge or distort the mouth, teeth, or head. Maintain natural skin texture and surrounding facial features.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and true-to-life but slightly vibrant colors.\\n\\nKeep the background, pose, framing, depth of field, and image quality exactly the same, with the braces appearing as a natural, in-camera detail. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "tatted",
    "category": "Looks",
    "label": "Tatted",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/tatted.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with face tattoos applied, captured with a modern iPhone camera look.\\n\\nAdd a forehead tattoo that reads \\\"Locket\\\" in an Old English / blackletter-style font. The text should be centered horizontally across the forehead, following the natural curvature of the skin. The lettering should be dark (black or very dark ink), with sharp edges, slight ink spread, and subtle skin absorption so it appears embedded in the skin rather than overlaid. Maintain slight distortion based on the curvature of the forehead and facial expression.\\n\\nOn the subject's right cheek (viewer's left if facing forward), place a small heart tattoo in the position where a teardrop tattoo would typically sit, just below the outer corner of the eye. The heart should be simple, clean-lined, and filled or slightly shaded, with natural ink softness at the edges.\\n\\nEnsure both tattoos integrate realistically with the skin, preserving pores, texture, and underlying highlights and shadows. The tattoos should not appear overly crisp or floating, and should follow the lighting of the scene with subtle fading where light hits more strongly.\\n\\nDo not alter the subject's face shape, expression, identity, or proportions. Keep the background, pose, framing, depth of field, and image quality exactly the same.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and true-to-life but slightly vibrant colors, so the tattoos appear naturally captured in-camera. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "beard",
    "category": "Looks",
    "label": "Beard",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/bearded.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with a full, full-length beard added to the face, captured with a modern iPhone camera look.\\n\\nGenerate a dense, natural beard that covers the cheeks, jawline, chin, and connects to the mustache, extending to a full length appropriate to the subject's proportions (ranging from medium-full to longer, but not exaggerated beyond realism). The beard should match the subject's existing hair color exactly, including undertones, and reflect their natural hair type (straight, wavy, or curly). Ensure consistent density variation, with slightly lighter growth on the upper cheeks and fuller density along the jaw and chin.\\n\\nThe beard should grow from the natural follicle pattern of the face, following realistic growth directions and contours. Include subtle variation in strand thickness, length, and color for realism, along with natural tapering at the edges. The mustache should integrate seamlessly with the beard, resting naturally over the upper lip without obscuring it excessively unless consistent with realistic growth.\\n\\nEnsure the beard conforms to the face without altering facial structure, jaw size, or head proportions. Maintain the exact silhouette of the face aside from the added hair volume. Add soft shadows within the beard and where it meets the skin to create depth, and include subtle highlights where light hits the hair.\\n\\nPreserve skin texture at the edges and beneath thinner areas of the beard. Ensure lighting, color, and depth match the original scene so the beard appears naturally present.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and true-to-life but slightly vibrant colors.\\n\\nDo not alter the subject's face, expression, identity, or pose. Keep the background, framing, depth of field, and image quality exactly the same, with the beard appearing as if it were naturally grown. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "buns",
    "category": "Looks",
    "label": "Buns",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/buns.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with the subject’s hair styled into two cute buns, captured with a modern iPhone camera look.\\n\\nArrange the hair into two symmetrical buns positioned on the upper left and right sides of the head. The buns should appear soft and slightly rounded with natural strand texture, subtle flyaways, and gentle volume. Ensure the buns follow gravity and the person’s head angle so they feel naturally styled rather than rigid.\\n\\nIf the subject’s original hair length or volume would not ordinarily support two buns, subtly increase the amount of hair only as needed to make the hairstyle plausible while keeping the original hairline, color, and texture consistent. Any added hair should blend seamlessly with the existing hair and not change the silhouette of the head beyond what the buns themselves require.\\n\\nIf a hat or headwear is present, remove it and replace it with the two-bun hairstyle. Ensure the hair where the hat previously sat appears naturally arranged and not flattened.\\n\\nMaintain natural lighting interaction with the hair, including soft highlights, shadows between strands, and realistic depth. Preserve the subject’s face, expression, identity, and head proportions.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and true-to-life but slightly vibrant colors.\\n\\nKeep the background, pose, framing, depth of field, and image quality exactly the same, with the hairstyle appearing as if it were naturally styled during capture. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "mohawk",
    "category": "Looks",
    "label": "Mohawk",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/mohawk.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with a mohawk hairstyle featuring shaved sides and a raised center strip, captured with a modern iPhone camera look.\\n\\nShave the hair on both sides of the head cleanly and closely to the scalp, following the natural head contour without changing the head shape or size. The shaved areas should show subtle scalp texture and natural tonal variation, with soft lighting and no added volume.\\n\\nIn the center, create a defined strip of longer hair running from the forehead to the back of the head. Style this strip upward so it stands raised and structured, with height and shape appropriate to the subject's original hair type. If the hair is straight, it should appear slicked up and slightly spiked with natural separation and light hold. If the hair is wavy or curly, preserve that texture in the raised section with volume and definition rather than forcing it straight.\\n\\nEnsure the hairline remains exactly the same and the silhouette of the head is not enlarged beyond the natural volume of the styled center strip. Add subtle flyaways and strand variation for realism.\\n\\nLighting should interact naturally with the hair, with highlights on the raised center and softer tones on the shaved sides. Maintain realistic shadows and depth consistent with the original scene.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and true-to-life but slightly vibrant colors.\\n\\nDo not alter the subject's face, expression, identity, or pose. Keep the background, framing, depth of field, and image quality exactly the same, with the hairstyle appearing as if it were naturally styled during capture. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "bob_cut",
    "category": "Looks",
    "label": "Bob Cut",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/bob.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with their hair cut into a bob hairstyle, captured with a modern iPhone camera look.\\n\\nTransform the hair into a chin-length bob cut that frames the face evenly on both sides. The cut should follow a clean horizontal line around the jaw area, with slight inward curvature at the ends. Maintain the subject's original hair type, whether straight, wavy, or curly, preserving its natural texture, density, and movement rather than forcing a different style.\\n\\nKeep the original hairline, parting, and color exactly the same. Only adjust the length and shape to achieve the bob. Ensure the volume remains realistic and does not enlarge the head shape. The silhouette of the head should stay consistent, with the bob sitting naturally against it.\\n\\nAdd subtle layering or softness at the ends so the cut does not appear overly blunt or artificial. Include natural strand variation, slight flyaways, and realistic edge detail.\\n\\nEnsure lighting interacts naturally with the hair, with highlights and shadows consistent with the scene. Preserve depth and texture so the hair appears physically present.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and true-to-life but slightly vibrant colors.\\n\\nDo not alter the subject's face, expression, identity, or pose. Keep the background, framing, depth of field, and image quality exactly the same, with the hairstyle appearing as if it were naturally worn during capture. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "bowling_ball",
    "category": "Looks",
    "label": "Bowling Ball",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/bowling_ball.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with a completely bald head.\\n\\nRemove all scalp hair while strictly preserving the original head shape, size, and silhouette. Do not expand, round, or alter the contour of the skull in any way. The hairline should be cleanly removed, revealing the natural scalp beneath, with the same proportions as the original head.\\n\\nThe scalp should appear smooth and clean with realistic skin texture, including fine pores and subtle tonal variation. Add a gentle, natural sheen to the scalp, with soft specular highlights that follow the lighting direction of the scene, giving a slightly shiny appearance without looking wet or overly reflective. Ensure highlights fall naturally along the curvature of the head and do not introduce artificial brightness.\\n\\nMaintain accurate shadowing around the head and where hair previously cast subtle shadows, adjusting only as needed to reflect the absence of hair while keeping the overall lighting consistent.\\n\\nDo not alter the person’s face, expression, or identity. Do not modify eyebrows, eyelashes, or any other facial hair unless already absent. Keep the background, pose, framing, depth of field, and image quality exactly the same, with the bald head appearing as if it were originally captured. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "blonde_bleached",
    "category": "Looks",
    "label": "Blond & Bleached",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/bleached_hair.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with a buzzed and bleached hairstyle.\\n\\nThe hair should be cut extremely close to the scalp (short buzz cut, nearly stubble length), clearly following the true contour of the skull. Do not add any additional volume or thickness that would expand the silhouette of the head. The outer edge of the head shape must remain identical to the original image, with no enlargement or rounding. The hair should read as a thin layer of texture on top of the existing scalp, not as a separate mass.\\n\\nThe color should be a clean, bleached blonde with slightly warm undertones, with subtle tonal variation across the scalp to maintain realism. Preserve visible scalp underneath the hair, with fine, short hair grain that blends seamlessly into the skin. Include slight natural irregularity in density and tone so it does not appear flat or painted on.\\n\\nEnsure lighting behaves consistently with the original image, with very soft highlights across the top of the scalp and gentle falloff along the sides, without introducing new shadow shapes that would imply added volume. Maintain accurate skin texture, pores, and natural variation.\\n\\nDo not alter the person’s face, expression, hairline position, or head proportions in any way. Keep the background, pose, framing, depth of field, and image quality exactly the same, with the hairstyle appearing as if it were originally captured. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "princess",
    "category": "Celebrate",
    "label": "Princess",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/princess.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but wearing a pink sash with white trim that says \\\"Princess,\\\" along with a tiara, captured with a modern iPhone camera look.\\n\\nThe sash should be a soft satin or silk-like material in a light pink tone, draped diagonally across the torso from shoulder to opposite hip. It should have clean white trim along the edges and the word \\\"Princess\\\" clearly printed or embroidered across the front in a legible, centered style. The fabric should follow the body naturally, with slight folds, tension, and curvature based on posture.\\n\\nAdd a tiara resting naturally on the head, aligned with the existing hairline without altering it. The tiara should be metallic (silver or white gold tone) with small reflective details such as rhinestones or gemstones that catch light subtly. It should sit securely with slight contact compression against the hair.\\n\\nEnsure both the sash and tiara match the scene’s lighting and perspective, with realistic highlights, reflections, and shadows. The materials should feel physically present, with proper depth and interaction with the subject.\\n\\nApply modern iPhone camera characteristics across the image: natural HDR, crisp detail, balanced highlights and shadows, and slightly enhanced but realistic colors. The additions should inherit this same processing so they appear captured in-camera.\\n\\nDo not alter the person’s face, expression, identity, or pose. Keep the background, framing, depth of field, and image quality exactly the same. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "cash_money",
    "category": "Celebrate",
    "label": "Ca$h Money",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/cash.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with U.S. $100 bills falling through the scene as if it is raining cash, captured with a modern iPhone camera look.\\n\\nAdd numerous $100 bills at varying depths throughout the frame, with a mix of sharp foreground bills and slightly blurred midground/background bills consistent with iPhone depth of field. The bills should be oriented in varied rotations and angles, with natural fluttering motion and slight motion blur on some to convey movement. A few bills can partially overlap the subject to enhance realism, while others remain behind.\\n\\nEnsure the bills are recognizable as U.S. $100 notes with accurate green and off-white tones, but rendered with the subtle processing of an iPhone camera: slightly boosted contrast, gentle sharpening, and balanced dynamic range. Whites should be clean but not blown out, and greens slightly vibrant without appearing artificial.\\n\\nApply iPhone-style image characteristics across the scene: crisp detail on the subject, mild HDR effect preserving highlights and shadows, and a natural but slightly warm color balance. The falling bills should inherit this same processing so they feel captured in-camera rather than composited.\\n\\nLighting on the bills should match the environment exactly, with soft highlights and consistent shadow direction. Include subtle occlusion where bills overlap each other or pass in front of the subject.\\n\\nDo not alter the person’s face, expression, pose, or any existing features. Keep the background, framing, and composition identical, with the raining cash appearing as a natural, in-camera moment. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "slimed",
    "category": "Celebrate",
    "label": "Slimed",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/slimed.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with thick green Nickelodeon-style slime being poured and splashing throughout the scene, captured with a modern iPhone camera look.\\n\\nAdd viscous, glossy green slime cascading from above, interacting naturally with gravity and the subject’s position. The slime should have a semi-translucent, gel-like consistency with varying thickness, forming drips, strands, and splashes as it makes contact with the subject and nearby surfaces. Allow the slime to accumulate realistically on horizontal surfaces such as shoulders, head, and any visible objects, with uneven pooling and slow drips forming.\\n\\nEnsure the slime conforms tightly to the subject where it touches, wrapping over contours of the face, hair, and clothing without altering underlying structure. Include small splatter droplets suspended mid-air at different depths, with some slightly motion-blurred to convey movement.\\n\\nLighting should interact strongly with the slime’s glossy surface, producing bright specular highlights and subtle internal scattering, while still matching the scene’s original light direction and intensity. Shadows should deepen slightly beneath thicker accumulations.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp subject detail, slightly enhanced contrast, and true-to-life but subtly vibrant greens that remain believable. The slime should inherit the same processing so it feels captured in-camera.\\n\\nDo not alter the person’s face, expression, identity, or pose. Keep the background, framing, depth of field, and image quality exactly the same, with the slime appearing as a natural, in-camera event. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "happy_birthday",
    "category": "Celebrate",
    "label": "Happy Birthday",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/happy_birthday.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with multicolored confetti falling through the scene, captured with a modern iPhone camera look.\\n\\nAdd a dense but natural distribution of confetti pieces at varying depths throughout the frame. The confetti should include a mix of small paper shapes (rectangles, squares, and occasional circles) in bright colors such as red, blue, yellow, green, pink, and purple. Some pieces should be sharp and in focus in the foreground, while others are slightly blurred in the midground and background to match the original depth of field.\\n\\nThe confetti should appear mid-fall, with varied orientations and slight motion blur on some pieces to convey movement. A few pieces can lightly overlap the subject, while others remain behind, creating a layered, dimensional effect.\\n\\nEnsure the confetti interacts realistically with the scene’s lighting, with subtle highlights on glossy pieces and softer, matte finishes on others. Include slight shadowing where pieces overlap or pass in front of the subject.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and slightly vibrant but realistic colors. The confetti should inherit this same processing so it feels captured in-camera.\\n\\nDo not alter the person’s face, expression, identity, or pose. Keep the background, framing, depth of field, and image quality exactly the same, with the confetti appearing as a natural, in-camera event. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "disco_lights",
    "category": "Celebrate",
    "label": "Disco",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/disco.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with disco-style lighting effects cast across the scene, captured with a modern iPhone camera look.\\n\\nAdd dynamic, multicolored disco light patterns projected onto the subject and background, including soft circular light spots and scattered beams in colors like red, blue, green, and purple. The lights should appear as if coming from an off-camera rotating disco ball or party light, with varying intensity and size across the frame.\\n\\nEnsure the light spots wrap naturally over the contours of the face, clothing, and environment, slightly warping with surface curvature. Some lights can appear sharper while others are softly diffused depending on depth of field and distance. Include subtle motion blur or variation in brightness to suggest movement without overwhelming the image.\\n\\nThe lighting should interact realistically with the existing scene, blending with the original light sources rather than replacing them. Maintain proper shadow behavior and avoid flattening the subject.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp subject detail, balanced highlights and shadows, and slightly vibrant but realistic colors. The disco lights should inherit this same processing so they feel captured in-camera.\\n\\nDo not alter the person’s face, expression, identity, or pose. Keep the background, framing, depth of field, and image quality exactly the same, with the lighting effect appearing as a natural part of the scene. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "flower_crown",
    "category": "Cute",
    "label": "Flower Crown",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/flower_crown.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but wearing a mixed wildflower crown.\\n\\nThe crown should be composed of a natural assortment of small wildflowers and greenery, including varied shapes and colors such as soft whites, yellows, purples, pinks, and light blues. Include delicate leaves and thin stems woven together into a slightly irregular, hand-made arrangement rather than a perfectly uniform band.\\n\\nPosition the crown so it rests naturally on top of the head, following the exact contour of the hair without altering the hairline, volume, or head shape. The flowers should sit lightly against the hair, with slight compression where they make contact and small overlaps between petals and strands for realism.\\n\\nEnsure the materials respond to the scene's lighting, with soft highlights on petals and subtle shadowing beneath the crown where it meets the hair. Colors should feel slightly varied and organic, not overly saturated or artificial.\\n\\nDo not change the person's face, expression, or any existing features. Keep the background, pose, framing, depth of field, and image quality exactly the same, with the crown appearing as if it were naturally worn in the original photo. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "cutesy",
    "category": "Cute",
    "label": "Cutesy",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/cutesy.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with cute rosy cheeks and a small cluster of freckles limited to the cheeks and the bridge of the nose, captured with a modern iPhone camera look.\\n\\nAdd a soft rosy blush to the apples of the cheeks using a warm pink tone. The blush should appear gentle and youthful with very soft, diffused edges, blending naturally into the surrounding skin while following the curvature of the cheeks.\\n\\nPlace freckles only across the bridge of the nose and the upper portions of both cheeks, forming a small, cute cluster centered around the nose. Do not extend freckles to the forehead, chin, temples, jawline, or other areas of the face. The freckles should vary slightly in size, shape, and opacity to avoid uniformity, using warm brown tones that complement the person's skin tone.\\n\\nEnsure the freckles follow the contours of the nose and cheeks and integrate naturally with the skin texture so pores and subtle tonal variation remain visible. Preserve existing highlights and shadows so the freckles and blush sit naturally within the lighting of the scene.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and slightly vibrant but realistic skin tones.\\n\\nDo not alter the person's facial structure, expression, identity, or pose. Keep the background, framing, depth of field, and image quality exactly the same, with the freckles and rosy cheeks appearing as a natural, in-camera effect. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "sticker_face",
    "category": "Cute",
    "label": "Sticker Face",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/sticker_face.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with a variety of multicolored heart-shaped stickers applied across the face in a playful, scattered arrangement similar to decorative sticker styling.\\n\\nDistribute the stickers naturally across areas such as the cheeks, forehead, and near the temples, avoiding the eyes, nostrils, and mouth opening unless placement already aligns naturally with the pose. Use a mix of sizes and colors (pinks, reds, purples, blues, yellows), with some stickers having a glossy or glitter finish that subtly catches light, and others appearing matte and flat.\\n\\nEach sticker should sit flush against the skin with slight edge lift or micro-shadowing where appropriate, giving a realistic adhered look. Ensure perspective and curvature match the face so stickers warp slightly with facial contours. Maintain subtle reflections on glossy stickers and fine sparkle detail on glitter ones without overpowering the image.\\n\\nPreserve the underlying skin texture, facial features, and expression exactly. Do not smooth or alter the skin beyond the sticker placement. Ensure lighting, shadows, and color integration match the original scene so the stickers appear naturally present.\\n\\nKeep the background, pose, framing, depth of field, and image quality identical to the original, with the stickers appearing as if they were physically applied during capture. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "love_bug",
    "category": "Cute",
    "label": "Love Bug",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/love_bug.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but wearing playful costume antennae with yellow hearts at the tips, captured with a modern iPhone camera look.\\n\\nAdd a lightweight headband sitting naturally on top of the head, aligned with the existing hair without altering the hairline or head shape. From the headband, include two thin, flexible antenna stalks extending upward, slightly curved and asymmetrical for a natural, springy feel. At the end of each antenna, place a small, rounded yellow heart shape with a soft, slightly glossy finish.\\n\\nThe antennae should respond subtly to gravity and motion, with gentle bends and slight variation in angle. The hearts should catch light with soft highlights and mild reflections, while the stalks have a matte or semi-matte texture. Ensure the base of the headband has slight contact with the hair, with minimal compression and realistic shadowing where it meets the head.\\n\\nLighting, shadows, and color should match the original scene, with the antennae and hearts appearing fully integrated. Apply modern iPhone camera characteristics across the image: natural HDR, crisp detail, balanced highlights and shadows, and slightly vibrant but realistic colors.\\n\\nDo not alter the person's face, expression, identity, or pose. Keep the background, framing, depth of field, and image quality exactly the same, with the costume appearing as if it were worn during capture. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "cowboy_cowgirl",
    "category": "Costumes",
    "label": "Cowboy & Cowgirl",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/cowboy.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with subjects dressed in Western attire appropriate to each person, captured with a modern iPhone camera look.\\n\\nIf a person is a woman, replace that person's clothing with cowgirl-style clothing made from white cowhide with natural brown spots. The outfit should include a cowhide cowgirl hat with the same white-and-brown spotted pattern, a fitted cowhide vest or jacket, and coordinating Western-style clothing that fits naturally to the body. The cowhide texture should show realistic hair-on-hide patterning with slight irregularity in the brown patches. The hat should sit naturally on the head without altering the hairline or head shape.\\n\\nIf a person is a man, replace that person's clothing with classic cowboy attire. Include a traditional brown cowboy hat made from felt or leather, worn naturally on the head. Pair it with Western-style clothing such as a button-up shirt, cowboy jacket or vest, and appropriate Western textures. The hat should follow the head's shape and lighting realistically.\\n\\nApply the appropriate styling independently to each person in the photo based on that person's gender presentation. Do not combine multiple looks onto the same person.\\n\\nEnsure all clothing materials respond to the scene's lighting with natural highlights, shadows, and texture. Cowhide surfaces should have subtle directional texture and pattern variation, while hats and fabrics should show realistic folds and structure consistent with the subject's pose.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and true-to-life but slightly vibrant colors so the clothing appears captured in-camera.\\n\\nDo not alter the subjects' faces, expressions, identities, or head proportions. Keep the background, pose, framing, depth of field, and image quality exactly the same. Do not create a split-screen, collage, side-by-side layout, duplicated frame, or any multi-panel composition. The result must remain a single continuous photo. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "giraffe",
    "category": "Costumes",
    "label": "Giraffe",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/giraffe.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with the subject wearing a giraffe costume, captured with a modern iPhone camera look.\\n\\nReplace the subject's clothing with a full giraffe costume suit featuring the recognizable giraffe pattern of warm tan fabric with irregular brown patches. The costume should appear soft and plush, like a wearable animal onesie or mascot-style outfit. Ensure the fabric has a slightly fuzzy texture with natural folds and compression consistent with the subject's pose.\\n\\nInclude a giraffe hood attached to the costume with small giraffe ears and short ossicones (the horn-like structures) on top. The hood should rest naturally on the head without changing the head shape or hairline. The giraffe face portion should sit above the subject's forehead like a costume hood rather than covering the subject's face, leaving the face fully visible.\\n\\nThe costume should follow the subject's body naturally with realistic fabric draping, wrinkles at joints, and gentle tension across the torso or shoulders depending on the pose. If hands or feet are visible, the costume may extend to matching giraffe-pattern sleeves or coverings, but do not add limbs if they are not present in the original image.\\n\\nEnsure the costume interacts naturally with the scene's lighting, with soft highlights on the plush fabric and shadows within folds. The giraffe pattern should vary slightly in shape and tone to feel organic rather than repeated.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and slightly vibrant but realistic colors.\\n\\nDo not alter the subject's face, expression, identity, or pose. Keep the background, framing, depth of field, and image quality exactly the same, with the costume appearing as if it were worn during capture. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "wedding",
    "category": "Costumes",
    "label": "Wedding",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/wedding.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but with subjects dressed in wedding attire appropriate to their presentation, captured with a modern iPhone camera look.\\n\\nFor female-presenting subjects, replace their clothing with an elegant lace wedding dress. The dress should feature delicate lace texture with fine floral patterns, layered fabric, and soft white or ivory tones. The bodice should fit naturally to the body with realistic seams and structure, while the skirt drapes with gentle folds and fabric movement consistent with the subject's posture. Lace details may appear along the neckline, sleeves, or shoulders depending on how the clothing aligns with the original pose.\\n\\nFor male-presenting subjects, replace their clothing with a groom's tuxedo. The tuxedo should include a fitted black jacket with satin lapels, a crisp white dress shirt, and a black bow tie. The jacket should follow the subject's natural body shape with realistic fabric folds and tension points. If visible, include matching black tuxedo trousers.\\n\\nEnsure the garments conform naturally to the subjects' bodies and poses, with accurate draping, fabric compression, and shadows. The clothing should interact with the scene's lighting realistically, with soft highlights on satin elements and subtle texture visible in lace areas.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and true-to-life but slightly vibrant colors so the clothing appears captured in-camera.\\n\\nDo not alter the subjects' faces, expressions, identities, or head proportions. Keep the background, pose, framing, depth of field, and image quality exactly the same. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "clown",
    "category": "Costumes",
    "label": "Clown",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/clown.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but styled as clowns, captured with a modern iPhone camera look.\\n\\nAdd a multicolored clown wig composed of bright, fluffy curls in colors such as red, blue, yellow, and green. The wig should appear soft and voluminous with natural curl variation. It should sit naturally on the head without changing the underlying head shape or hairline.\\n\\nPlace a classic round clown nose on the subject’s nose. The nose should be bright red with a slightly matte rubber texture and soft specular highlights consistent with the scene’s lighting. It should fit naturally over the nose with a faint contact shadow where it meets the skin.\\n\\nReplace the subject’s clothing with a clown costume featuring bright, playful colors and soft fabric textures. The costume can include bold multicolored panels, oversized buttons, and loose-fitting sleeves or ruffles. The fabric should drape naturally with realistic folds and movement based on the subject’s posture.\\n\\nEnsure the wig, nose, and costume all interact realistically with the lighting and environment, with proper highlights, shadows, and depth.\\n\\nApply modern iPhone camera characteristics across the entire image: natural HDR, crisp detail, balanced highlights and shadows, and slightly vibrant but realistic colors so the costume appears captured in-camera.\\n\\nDo not alter the subject’s face, expression, identity, pose, or background. Keep the framing, depth of field, and image quality exactly the same. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "sweet_hearts",
    "category": "Holidays",
    "label": "Sweet Hearts",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/sweat_hearts.png",
    "promptInstruction": "Show the person in the photo with the exact same pose and background, but have them holding a big candy heart. The color of the candy heart should be picked randomly from the following list: Light pink, White, Yellow, Orange, Green, Purple. The phrase should be a short one-to-two word phrase be picked randomly from the following list: Be Mine, Love You, Kiss Me, Hug Me, XOXO, Cutie. Keep their pose and background identical. If no person is present in the input, do not add anything to the output. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "bearded",
    "category": "Holidays",
    "label": "Bearded",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/bearded.png",
    "promptInstruction": "Show the person in the photo with the exact same pose and background, but give them a short medium-length ginger beard and matching ginger eyebrows. Keep the face, hairstyle, and everything else the same. Keep their pose and background identical. If no person is present, return the image unaltered. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "frosty",
    "category": "Holidays",
    "label": "Frosty",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/frosty.png",
    "promptInstruction": "Show the person in the photo with the exact same pose and background, but with themselves and the background covered in snow. Ensure the person is in the exact same pose and positioning within the frame. If no face is present, do not show any people in the output, only ever show people who were in the original input image. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "elf_cutout",
    "category": "Holidays",
    "label": "Elf",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/elf.png",
    "promptInstruction": "Show the person in the photo with the exact same pose and background, but dressed up as an Elf. Ensure the person is in the exact same pose and positioning within the frame. If no face is present, do not show any people in the output, only ever show people who were in the original input image. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "santa_cutout",
    "category": "Holidays",
    "label": "Santa",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/santa.png",
    "promptInstruction": "Show the person in the photo with the exact same pose and background, but dressed up as Santa Claus. Ensure the person is in the exact same pose and positioning within the frame. If no face is present, do not show any people in the output, only ever show people who were in the original input image.  Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "easter_bunney_cutout",
    "category": "Holidays",
    "label": "Easter Bunny",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/easter_bunny.png",
    "promptInstruction": "Show the people in the photo with the exact same pose and background, but put the person in an Easter Bunny costume: fluffy white costume, oversized bunny hood with long pink-lined ears, white gloves, white furry feet. Keep the person’s face visible (no full mask), preserve their exact likeness, pose, lighting, and background. Photorealistic, clean costume seams, soft fur texture, no other changes. If any of the body parts mentioned (for example hands and feet) are not present, do not add them to the photo. If no people are present, return the image unaltered. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "leprechaun",
    "category": "Holidays",
    "label": "Leprechaun",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/leprechaun.png",
    "promptInstruction": "Show the person in the photo with the exact same pose, framing, expression, and background, but dress them in leprechaun costume: a green top hat with a gold buckle and black band as well as matching outfit. Keep their pose and background identical. Do not change the person’s face, hairstyle, body shape, position in frame, likeness, or facial expression. Do not remove anyone from the original photo. Do not add extra people or limbs. If no person is present, return the image unaltered. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "easter_chick_cutout",
    "category": "Holidays",
    "label": "Easter Chick",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/easter_chick.png",
    "promptInstruction": "Show the persons in the photo with the exact same pose and background, but put them in a bright yellow Easter chick costume: a fluffy yellow onesie suit with a rounded hood, small orange beak on the hood above the forehead, and tiny chick wings as sleeves. Add soft plush texture and natural folds. Keep the person’s face, hairline (if visible), pose, and background exactly the same. If any of the body parts mentioned (for example hands and feet) are not present, do not add them to the photo. If no people are present, return the image unaltered. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "lucky_face",
    "category": "Holidays",
    "label": "Lucky Face",
    "iconUrl": "https://cdn.locket-dio.com/v1/filter_icons/lucky_face.png",
    "promptInstruction": "Show the person in the photo with the exact same pose and background, but add cute, subtle freckles concentrated across the bridge of the nose and upper cheeks. Add small green clover sticker decals on both cheeks (one per cheek), glossy sticker texture with clean edges. Keep the person's likeness, pose, lighting, and background unchanged. Photorealistic, natural skin texture, no extra makeup, no other changes. If no person is present, return the image unaltered. Do not change the overall compsition of the photo, do not add new people to the photo, only show each person in the photo one time."
  },
  {
    "id": "photobooth",
    "category": "Photobooth",
    "label": "Korean Photobooth 4-Cut",
    "promptInstruction": "captured with a Korean photobooth 4-cut strip aesthetic, vintage soft studio lighting, clear facial features, modern iPhone camera look"
  },
  {
    "id": "photobooth_cute",
    "category": "Photobooth",
    "label": "Photobooth Cute Pastel",
    "promptInstruction": "captured with a cute pastel kawaii photobooth aesthetic, soft dreamy lighting, clear facial features"
  },
  {
    "id": "pb_strawberry",
    "category": "Photobooth",
    "label": "Photobooth Strawberry",
    "promptInstruction": "captured with a cute pastel strawberry photobooth aesthetic, soft rosy lighting, modern iPhone camera look"
  },
  {
    "id": "pb_vintage",
    "category": "Photobooth",
    "label": "Photobooth Vintage 90s",
    "promptInstruction": "captured with vintage 90s film photobooth aesthetic, warm nostalgic grain and soft flash lighting"
  },
  {
    "id": "pb_galaxy",
    "category": "Photobooth",
    "label": "Photobooth Galaxy",
    "promptInstruction": "captured with dreamy galaxy stars ambient glow aesthetic, soft cosmic studio lighting"
  },
  {
    "id": "pb_holo_4cut",
    "category": "Photobooth",
    "label": "Photobooth Holographic Y2K",
    "promptInstruction": "captured with holographic Y2K photobooth aesthetic, iridescent chrome shine and soft studio lighting"
  },
  {
    "id": "frame_classic_pb",
    "category": "Photobooth",
    "label": "Classic B&W Photobooth",
    "promptInstruction": "captured with classic black and white film photobooth aesthetic, dramatic soft studio contrast"
  },
  {
    "id": "rose_flower",
    "category": "Effects",
    "label": "Rose Flower (Hoa hồng)",
    "promptInstruction": "holding a single red rose flower with romantic warm cinematic lighting, preserving exact pose and background"
  },
  {
    "id": "golden_hour",
    "category": "Effects",
    "label": "Golden Hour (Nắng chiều)",
    "promptInstruction": "bathed in rich warm sunset golden hour sunlight glow and soft shadows, preserving exact pose and background"
  },
  {
    "id": "watercolor_art",
    "category": "Effects",
    "label": "Watercolor Art (Màu nước)",
    "promptInstruction": "delicate hand-painted watercolor illustration artwork with soft brush strokes and artistic paper texture"
  },
  {
    "id": "harry_potter",
    "category": "Effects",
    "label": "Harry Potter Wizard",
    "promptInstruction": "dressed as a Hogwarts wizard wearing a dark academic robe and scarf, magical candlelit castle lighting"
  },
  {
    "id": "minecraft",
    "category": "Effects",
    "label": "Minecraft Voxel",
    "promptInstruction": "transformed into a stylized blocky Minecraft 3D voxel world aesthetic while preserving pose and scene"
  },
  {
    "id": "shrek_ogre",
    "category": "Effects",
    "label": "Shrek Ogre",
    "promptInstruction": "playful transformation with green Shrek ogre rounded ears and rustic tunic while preserving exact pose"
  },
  {
    "id": "superhero_cape",
    "category": "Effects",
    "label": "Superhero Cape",
    "promptInstruction": "dressed in a vibrant blue and red superhero suit with flowing red cape, dramatic studio lighting"
  },
  {
    "id": "pirate_hat",
    "category": "Effects",
    "label": "Pirate Captain",
    "promptInstruction": "dressed like a movie pirate captain with weathered leather tricorn hat and coat, preserving exact pose"
  },
  {
    "id": "ocean_underwater",
    "category": "Effects",
    "label": "Ocean Underwater",
    "promptInstruction": "underwater ocean blue light caustics and floating bubbles around the portrait, preserving exact pose"
  },
  {
    "id": "fireworks",
    "category": "Effects",
    "label": "Fireworks (Pháo hoa)",
    "promptInstruction": "night sky filled with colorful exploding fireworks reflections across the scene, preserving exact pose"
  }
];
