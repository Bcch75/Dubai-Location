// ═══════════════════════════════════════════════════════════
//  Recadrage d'une photo avant l'envoi (espace admin)
// ═══════════════════════════════════════════════════════════
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const RATIOS: [string, number][] = [['Libre', NaN], ['Carré', 1], ['4:3', 4 / 3], ['16:9', 16 / 9], ['Portrait', 3 / 4]];

/** Ouvre la fenêtre de recadrage. Renvoie la photo recadrée, ou null si on annule. */
export function cropImage(file: File, ratio = NaN, round = false): Promise<File | null> {
  return new Promise((resolve) => {
    const src = URL.createObjectURL(file);
    const d = document.createElement('dialog');
    d.className = 'crop-dlg';
    d.innerHTML = `
      <div class="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
        <button type="button" data-cancel class="text-sm font-medium text-gray-500">Annuler</button>
        <b class="text-sm">Recadrer la photo</b>
        <button type="button" data-ok class="rounded-full bg-[#0171eb] px-4 py-1.5 text-sm font-semibold text-white">Valider</button>
      </div>
      <div class="crop-area bg-gray-900"><img alt="" style="display:block;max-width:100%"></div>
      <div class="flex flex-wrap items-center justify-center gap-1.5 px-3 py-3">
        ${RATIOS.map(([l, r]) => `<button type="button" data-r="${r}" class="crop-chip">${l}</button>`).join('')}
        <button type="button" data-rot class="crop-chip">↻ Pivoter</button>
      </div>`;
    document.body.append(d);
    const im = d.querySelector('img')!;
    let cropper: Cropper | null = null;
    const paintChips = (r: number) => d.querySelectorAll<HTMLElement>('[data-r]').forEach((b) => b.classList.toggle('on', String(r) === b.dataset.r));
    im.onload = () => {
      cropper = new Cropper(im, { aspectRatio: ratio, viewMode: 1, dragMode: 'move', autoCropArea: 0.9, background: false, responsive: true, checkOrientation: true });
      paintChips(ratio);
    };
    im.src = src;
    if (round) d.classList.add('crop-round');
    const close = (out: File | null) => { cropper?.destroy(); URL.revokeObjectURL(src); d.close(); d.remove(); resolve(out); };
    d.addEventListener('cancel', (e) => { e.preventDefault(); close(null); });
    d.querySelector('[data-cancel]')!.addEventListener('click', () => close(null));
    d.querySelector('[data-rot]')!.addEventListener('click', () => cropper?.rotate(90));
    d.querySelectorAll<HTMLElement>('[data-r]').forEach((b) => b.addEventListener('click', () => { const r = +b.dataset.r!; cropper?.setAspectRatio(r); paintChips(r); }));
    d.querySelector('[data-ok]')!.addEventListener('click', () => {
      if (!cropper) return;
      const png = /png|svg/i.test(file.type);
      const canvas = cropper.getCroppedCanvas({ maxWidth: 2400, maxHeight: 2400, imageSmoothingQuality: 'high', fillColor: png ? 'transparent' : '#fff' });
      canvas.toBlob((blob) => {
        if (!blob) return close(file);
        const name = file.name.replace(/\.[^.]+$/, '') + (png ? '.png' : '.jpg');
        close(new File([blob], name, { type: blob.type }));
      }, png ? 'image/png' : 'image/jpeg', 0.9);
    });
    d.showModal();
  });
}
