
const { config, createAudioFromText } = require('tiktok-tts')
const path = require('path')


    ; (async () => {
        config('67d99738f7855bf0bc05ee8f153f29e1');
        const text = `
        Di padang rumput yang luas, seekor kuda betina bernama Bella berlari dengan leluasa. Kecanggihan gerakannya mempesona siapa pun yang melihatnya. Bella adalah kuda yang penuh semangat dan keanggunan, memiliki bulu cokelat yang mengkilap dan mata yang penuh dengan kecerdasan.

Setiap pagi, Bella dibawa keluar oleh petani setia, Jack. Mereka berdua memiliki ikatan yang tak terpisahkan. Jack mengenal Bella sejak ia masih kuda kecil. Mereka berdua telah mengalami berbagai petualangan bersama, dari berlomba di padang terbuka hingga menyeberangi sungai yang deras.

Suatu hari, ketika musim gugur tiba, Bella dan Jack memutuskan untuk menjelajahi hutan yang berwarna-warni. Mereka menelusuri jalan yang berliku-liku di antara pepohonan yang meranggas. Bella dengan gesitnya menavigasi medan yang sulit, sementara Jack memandang pemandangan yang indah dengan penuh kagum.

Namun, tiba-tiba cuaca berubah menjadi buruk. Angin kencang mulai bertiup, dan hujan deras pun turun dengan cepat. Bella dan Jack terjebak di tengah hutan yang gelap dan lebat. Namun, Bella tidak gentar. Dengan penuh keberanian, dia membimbing Jack melalui jalan setapak yang licin dan berlumpur.

Akhirnya, setelah perjalanan yang panjang dan melelahkan, Bella dan Jack berhasil keluar dari hutan. Mereka tiba di padang rumput yang luas di mana matahari mulai bersinar kembali. Jack bersyukur kepada Bella atas ketangguhannya dan bersumpah akan selalu menjaganya dengan baik.

Sejak saat itu, Bella dan Jack menjadi lebih dekat. Mereka mengerti bahwa meskipun petualangan seringkali penuh dengan tantangan, dengan keberanian dan kesetiaan, mereka dapat mengatasi segalanya bersama-sama. Dan begitulah kisah tentang kuda pemberani bernama Bella, yang selalu siap untuk menjelajahi dunia dengan Jack di sisinya.
        `
        const text2 = text.split('.')

        for (let i = 0; i < text2.length; i++) {
            await createAudioFromText(text2[i], path.join(__dirname, "./audio/audio_" + i + ".mp3"), "id_001")
            console.log('audio_' + i + '.mp3')
        }
    })()


