/* ============================================================
   main.js — Phakhaphun Rodrunda Portfolio
   ============================================================
   1. Modal (open / close)
   2. Skills accordion
   3. Carousel (card-level) — move / goTo / scroll-sync
   4. Modal carousel — openProject / openImg / modalMove / modalGoTo
   ============================================================ */


/* ============================================================
   1. Modal — open / close
   ============================================================ */
const modal      = document.getElementById('cert-modal')
const modalClose = document.getElementById('modal-close')

modalClose.addEventListener('click', () => modal.classList.remove('active'))
modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active')
})


/* ============================================================
   2. Skills accordion
   ============================================================ */
function toggleSkill(card) {
    const body   = card.querySelector('.skill-body')
    const arrow  = card.querySelector('.arrow')
    const isOpen = body.classList.contains('open')

    // ปิดทุก card ก่อน
    document.querySelectorAll('.skill-body').forEach(b => b.classList.remove('open'))
    document.querySelectorAll('.arrow').forEach(a => a.classList.remove('open'))

    // ถ้ายังไม่เปิด → เปิด
    if (!isOpen) {
        body.classList.add('open')
        arrow.classList.add('open')
    }
}


/* ============================================================
   3. Carousel (card-level)
   ============================================================ */

/**
 * scroll track ไปยัง slide index ที่ต้องการ
 * ใช้ scrollTo แทน scrollLeft = ... เพื่อให้ได้ smooth scroll
 * และหลีกเลี่ยงปัญหา offsetWidth ใน iPad ที่ได้ค่าผิดบางครั้ง
 */
function scrollToSlide(track, index) {
    const slideWidth = track.querySelector('.carousel-slide').getBoundingClientRect().width
    track.scrollTo({ left: index * slideWidth, behavior: 'smooth' })
    track.dataset.current = index
}

function updateDots(wrap, index) {
    wrap.querySelectorAll('.carousel-dots .dot').forEach((d, i) => {
        d.classList.toggle('active', i === index)
    })
}

function updateCounter(wrap, index) {
    const total   = wrap.querySelectorAll('.carousel-slide').length
    const counter = wrap.querySelector('.carousel-counter')
    if (counter) counter.textContent = `${index + 1} / ${total}`
}

/** ปุ่ม ‹ › */
function move(btn, dir) {
    const wrap  = btn.closest('.carousel-wrap')
    const track = wrap.querySelector('.carousel-track')
    const total = wrap.querySelectorAll('.carousel-slide').length

    let current = parseInt(track.dataset.current || 0)
    current = (current + dir + total) % total

    scrollToSlide(track, current)
    updateDots(wrap, current)
    updateCounter(wrap, current)
}

/** dot click */
function goTo(wrap, index) {
    const track = wrap.querySelector('.carousel-track')

    scrollToSlide(track, index)
    updateDots(wrap, index)
    updateCounter(wrap, index)
}

/** สร้าง dots + counter และ sync เมื่อลากด้วยนิ้ว */
document.querySelectorAll('.carousel-wrap').forEach(wrap => {
    const slides  = wrap.querySelectorAll('.carousel-slide')
    const dots    = wrap.querySelector('.carousel-dots')
    const counter = wrap.querySelector('.carousel-counter')
    const total   = slides.length
    const track   = wrap.querySelector('.carousel-track')

    // ถ้ามีแค่ 1 slide → ซ่อนปุ่มและ dots
    if (total <= 1) {
        const btnPrev = wrap.querySelector('.btn-prev')
        const btnNext = wrap.querySelector('.btn-next')
        if (btnPrev) btnPrev.style.display = 'none'
        if (btnNext) btnNext.style.display = 'none'
        if (counter) counter.style.display = 'none'
        return
    }

    // สร้าง dot ตามจำนวน slide
    slides.forEach((_, i) => {
        const dot = document.createElement('div')
        dot.classList.add('dot')
        if (i === 0) dot.classList.add('active')
        dot.addEventListener('click', () => goTo(wrap, i))
        dots.appendChild(dot)
    })

    if (counter) counter.textContent = `1 / ${total}`

    // sync dots + counter เมื่อผู้ใช้ลาก scroll ด้วยนิ้ว
    track.addEventListener('scroll', () => {
        const slideWidth = track.querySelector('.carousel-slide').getBoundingClientRect().width
        if (slideWidth === 0) return  // guard: ยังไม่ render

        const index = Math.round(track.scrollLeft / slideWidth)
        track.dataset.current = index
        updateDots(wrap, index)
        updateCounter(wrap, index)
    }, { passive: true })
})


/* ============================================================
   4. Modal carousel — openProject / openImg / modalMove / modalGoTo
   ============================================================ */
let modalCurrent = 0
let modalTotal   = 0

function openProject(event, images, title) {
    event.stopPropagation()

    const modal    = document.getElementById('cert-modal')
    const track    = document.getElementById('modal-track')
    const dots     = document.getElementById('modal-dots')
    const counter  = document.getElementById('modal-counter')
    const titleEl  = document.getElementById('modal-title')
    const btnPrev  = document.querySelector('#cert-modal .m-btn:first-of-type')
    const btnNext  = document.querySelector('#cert-modal .m-btn:last-of-type')

    // รีเซ็ต
    track.innerHTML = ''
    dots.innerHTML  = ''
    track.scrollLeft = 0
    modalCurrent = 0
    modalTotal   = images.length
    if (titleEl) titleEl.textContent = title

    // ซ่อน/แสดงปุ่มและ counter ตามจำนวนรูป
    const single = images.length <= 1
    btnPrev.style.display = single ? 'none' : 'flex'
    btnNext.style.display = single ? 'none' : 'flex'
    counter.style.display = single ? 'none' : 'block'

    // สร้าง slide
    images.forEach((src, i) => {
        const slide = document.createElement('div')
        slide.className = 'modal-slide'

        const img = document.createElement('img')
        img.src = src
        img.alt = `${title} ${i + 1}`
        img.onerror = function () {
            slide.classList.add('skeleton-slide')
            slide.textContent = 'ยังไม่มีรูปผลงาน'
            this.remove()
        }

        slide.appendChild(img)
        track.appendChild(slide)

        if (!single) {
            const dot = document.createElement('div')
            dot.className = 'dot' + (i === 0 ? ' active' : '')
            dot.addEventListener('click', () => modalGoTo(i))
            dots.appendChild(dot)
        }
    })

    if (!single) counter.textContent = `1 / ${modalTotal}`

    modal.classList.add('active')

    // sync dots + counter เมื่อลากด้วยนิ้วใน modal
    track.onscroll = () => {
        const slideWidth = track.querySelector('.modal-slide')?.getBoundingClientRect().width
        if (!slideWidth) return
        const index = Math.round(track.scrollLeft / slideWidth)
        if (index === modalCurrent) return
        modalCurrent = index
        document.querySelectorAll('#modal-dots .dot').forEach((d, i) => {
            d.classList.toggle('active', i === index)
        })
        counter.textContent = `${index + 1} / ${modalTotal}`
    }
}

function modalMove(dir) {
    modalCurrent = (modalCurrent + dir + modalTotal) % modalTotal
    modalGoTo(modalCurrent)
}

function modalGoTo(index) {
    modalCurrent = index
    const track = document.getElementById('modal-track')
    const slideWidth = track.querySelector('.modal-slide')?.getBoundingClientRect().width || track.offsetWidth
    track.scrollTo({ left: index * slideWidth, behavior: 'smooth' })
    document.querySelectorAll('#modal-dots .dot').forEach((d, i) => {
        d.classList.toggle('active', i === index)
    })
    document.getElementById('modal-counter').textContent = `${index + 1} / ${modalTotal}`
}

function openImg(imgSrc, title) {
    const fakeEvent = { stopPropagation: () => {} }
    openProject(fakeEvent, [imgSrc], title)
}

/* Contact form */
function handleForm(e) {
    e.preventDefault()
    document.getElementById('form-msg').style.display = 'block'
}