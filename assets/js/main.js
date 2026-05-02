const modal = document.getElementById('cert-modal')
const modalImg = document.getElementById('modal-img')
const modalClose = document.getElementById('modal-close')

document.querySelectorAll('.cert-card img').forEach(img => {
  img.addEventListener('click', function() {
    modalImg.src = this.src
    modal.classList.add('active')
  })
})

modalClose.addEventListener('click', function() {
  modal.classList.remove('active')
})

modal.addEventListener('click', function(e) {
  if (e.target === modal) modal.classList.remove('active')
})

// Skills accordion
function toggleSkill(card) {
    const body = card.querySelector('.skill-body')
    const arrow = card.querySelector('.arrow')
    const isOpen = body.classList.contains('open')

    // ปิดทุก card ก่อน
    document.querySelectorAll('.skill-body').forEach(b => b.classList.remove('open'))
    document.querySelectorAll('.arrow').forEach(a => a.classList.remove('open'))

    // ถ้ายังไม่เปิด ให้เปิด
    if (!isOpen) {
        body.classList.add('open')
        arrow.classList.add('open')
    }
}

let modalCurrent = 0
let modalTotal = 0

function openProject(event, images, title) {
    event.stopPropagation()

    const modal = document.getElementById('cert-modal')
    const track = document.getElementById('modal-track')
    const dots = document.getElementById('modal-dots')
    const counter = document.getElementById('modal-counter')
    const titleEl = document.getElementById('modal-title')

    // รีเซ็ต
    track.innerHTML = ''
    dots.innerHTML = ''
    track.style.transform = 'translateX(0)'
    modalCurrent = 0
    modalTotal = images.length
    titleEl.textContent = title

    // สร้าง slide
    images.forEach((src, i) => {
        const slide = document.createElement('div')
        slide.className = 'modal-slide'
        const img = document.createElement('img')
        img.src = src
        img.alt = `${title} ${i + 1}`
        img.onerror = function() {
            slide.classList.add('skeleton-slide')
            slide.textContent = 'ยังไม่มีรูปผลงาน'
            this.remove()
        }
        slide.appendChild(img)
        track.appendChild(slide)

        // dot
        const dot = document.createElement('div')
        dot.className = 'dot' + (i === 0 ? ' active' : '')
        dot.onclick = () => modalGoTo(i)
        dots.appendChild(dot)
    })

    counter.textContent = `1 / ${modalTotal}`
    modal.classList.add('active')
}

function modalMove(dir) {
    modalCurrent = (modalCurrent + dir + modalTotal) % modalTotal
    modalGoTo(modalCurrent)
}

function modalGoTo(index) {
    modalCurrent = index
    document.getElementById('modal-track').style.transform = `translateX(-${index * 100}%)`
    document.querySelectorAll('#modal-dots .dot').forEach((d, i) => {
        d.classList.toggle('active', i === index)
    })
    document.getElementById('modal-counter').textContent = `${index + 1} / ${modalTotal}`
}

// Carousel
function move(btn, dir) {
    const wrap = btn.closest('.carousel-wrap')
    const track = wrap.querySelector('.carousel-track')
    const dots = wrap.querySelector('.carousel-dots')
    const counter = wrap.querySelector('.carousel-counter')
    const total = wrap.querySelectorAll('.carousel-slide').length

    let current = parseInt(track.dataset.current || 0)
    current = (current + dir + total) % total

    // เปลี่ยนจาก transform มาเป็น scrollLeft
    track.scrollLeft = current * track.offsetWidth
    track.dataset.current = current

    // อัพเดท dots
    dots.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current)
    })

    // อัพเดท counter
    counter.textContent = `${current + 1} / ${total}`
}

// สร้าง dots และ counter อัตโนมัติ
document.querySelectorAll('.carousel-wrap').forEach(wrap => {
    const slides = wrap.querySelectorAll('.carousel-slide')
    const dots = wrap.querySelector('.carousel-dots')
    const counter = wrap.querySelector('.carousel-counter')
    const total = slides.length

    // สร้าง dot ตามจำนวน slide
    slides.forEach((_, i) => {
        const dot = document.createElement('div')
        dot.classList.add('dot')
        if (i === 0) dot.classList.add('active')
        dot.onclick = () => goTo(wrap, i)
        dots.appendChild(dot)
    })

    // counter เริ่มต้น
    counter.textContent = `1 / ${total}`
})

function goTo(wrap, index) {
    const track = wrap.querySelector('.carousel-track')
    const dots = wrap.querySelector('.carousel-dots')
    const counter = wrap.querySelector('.carousel-counter')
    const total = wrap.querySelectorAll('.carousel-slide').length


    track.scrollLeft = index * track.offsetWidth
    track.dataset.current = index

    dots.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === index)
    })

    counter.textContent = `${index + 1} / ${total}`
}

// อัพเดท dots เมื่อ scroll ด้วยนิ้ว
document.querySelectorAll('.carousel-track').forEach(track => {
    track.addEventListener('scroll', function() {
        const wrap = track.closest('.carousel-wrap')
        const dots = wrap.querySelector('.carousel-dots')
        const counter = wrap.querySelector('.carousel-counter')
        const total = wrap.querySelectorAll('.carousel-slide').length

        // คำนวณว่าตอนนี้อยู่ slide ไหน
        const index = Math.round(track.scrollLeft / track.offsetWidth)

        // อัพเดท dots
        dots.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === index)
        })

        // อัพเดท counter
        counter.textContent = `${index + 1} / ${total}`

        // sync กับ dataset ให้ปุ่ม ‹ › ทำงานถูกต้องด้วย
        track.dataset.current = index
    })
})

function handleForm(e) {
    e.preventDefault()
    document.getElementById('form-msg').style.display = 'block'
}

function openImg(imgSrc, title) {
    const modal = document.getElementById('cert-modal')
    const modalImg = document.getElementById('modal-img')
    const skeleton = document.getElementById('modal-skeleton')

    modalImg.src = imgSrc
    modalImg.alt = title
    modalImg.style.display = 'block'
    skeleton.style.display = 'none'

    modal.classList.add('active')
}