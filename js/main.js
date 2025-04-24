/**
 * Script principal para o Portfólio de Desenvolvedor Web
 * Autor: Desenvolvedor Web
 * Data: Abril 2025
 */

// Esperar que o DOM seja completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar link para pular navegação (acessibilidade)
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Pular para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Implementar lazy loading para imagens
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback para navegadores que não suportam IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // Verificar responsividade
    const checkResponsiveness = () => {
        const width = window.innerWidth;
        console.log(`Viewport width: ${width}px`);
        
        // Adicionar classe ao body baseado no tamanho da tela
        if (width < 480) {
            document.body.classList.add('mobile');
            document.body.classList.remove('tablet', 'desktop');
        } else if (width < 992) {
            document.body.classList.add('tablet');
            document.body.classList.remove('mobile', 'desktop');
        } else {
            document.body.classList.add('desktop');
            document.body.classList.remove('mobile', 'tablet');
        }
    };
    
    // Verificar responsividade no carregamento e no redimensionamento
    checkResponsiveness();
    window.addEventListener('resize', checkResponsiveness);
    // Elementos do DOM
    const preloader = document.querySelector('.preloader');
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const themeToggle = document.querySelector('.theme-toggle');
    const backToTop = document.querySelector('.back-to-top');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projetoCards = document.querySelectorAll('.projeto-card');
    const depoimentoDots = document.querySelectorAll('.dot');
    const depoimentoCards = document.querySelectorAll('.depoimento-card');
    const contactForm = document.getElementById('contact-form');

    // Remover preloader após o carregamento da página
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    });

    // Header fixo ao rolar a página
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
            backToTop.classList.add('active');
        } else {
            header.classList.remove('sticky');
            backToTop.classList.remove('active');
        }

        // Ativar links do menu conforme a seção visível
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Menu mobile toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Fechar menu ao clicar em um link (mobile)
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });

    // Alternar entre modo claro e escuro
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Alternar ícone
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Verificar preferência de tema salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').classList.remove('fa-moon');
        themeToggle.querySelector('i').classList.add('fa-sun');
    }

    // Filtro de projetos
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover classe active de todos os botões
            filterBtns.forEach(b => b.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projetoCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                
                // Adicionar animação de fade-in
                setTimeout(() => {
                    if (card.style.display === 'block') {
                        card.style.opacity = '1';
                    }
                }, 100);
            });
        });
    });

    // Slider de depoimentos
    let currentSlide = 0;
    
    // Esconder todos os slides exceto o primeiro
    for (let i = 1; i < depoimentoCards.length; i++) {
        depoimentoCards[i].style.display = 'none';
    }
    
    // Função para mostrar slide específico
    function showSlide(index) {
        // Esconder todos os slides
        depoimentoCards.forEach(card => {
            card.style.display = 'none';
            card.style.opacity = '0';
        });
        
        // Remover classe active de todos os dots
        depoimentoDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Mostrar slide atual
        depoimentoCards[index].style.display = 'block';
        setTimeout(() => {
            depoimentoCards[index].style.opacity = '1';
        }, 100);
        
        // Ativar dot correspondente
        depoimentoDots[index].classList.add('active');
        
        // Atualizar índice atual
        currentSlide = index;
    }
    
    // Adicionar evento de clique aos dots
    depoimentoDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Avançar slide automaticamente a cada 5 segundos
    setInterval(() => {
        let nextSlide = currentSlide + 1;
        if (nextSlide >= depoimentoCards.length) {
            nextSlide = 0;
        }
        showSlide(nextSlide);
    }, 5000);

    // Animação de elementos ao scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.skill-card, .projeto-card, .depoimento-card, .section-header');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate-fade-in');
            }
        });
    };
    
    // Adicionar classe para animação CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .animate-fade-in {
            animation: fadeIn 0.8s forwards;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Chamar função de animação ao scroll
    window.addEventListener('scroll', animateOnScroll);
    // Chamar uma vez para animar elementos já visíveis
    animateOnScroll();


    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const assunto = document.getElementById('assunto').value;
            const mensagem = document.getElementById('mensagem').value;
    
            if (!nome || !email || !assunto || !mensagem) {
                showFormMessage('Por favor, preencha todos os campos.', 'error');
                return;
            }
    
            try {
                const response = await fetch("https://formspree.io/f/xanoygyd", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        nome,
                        email,
                        assunto,
                        mensagem
                    })
                });
    
                if (response.ok) {
                    showFormMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage('Erro ao enviar mensagem. Tente novamente mais tarde.', 'error');
                }
            } catch (error) {
                showFormMessage('Erro de conexão. Tente novamente.', 'error');
                console.error(error);
            }
        });
    }
    
    function showFormMessage(message, type) {
        const oldMessage = document.querySelector('.form-message');
        if (oldMessage) oldMessage.remove();
    
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
    
        messageElement.style.padding = '10px';
        messageElement.style.marginTop = '10px';
        messageElement.style.borderRadius = '5px';
    
        if (type === 'success') {
            messageElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            messageElement.style.color = '#4CAF50';
            messageElement.style.border = '1px solid #4CAF50';
        } else {
            messageElement.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
            messageElement.style.color = '#F44336';
            messageElement.style.border = '1px solid #F44336';
        }
    
        contactForm.appendChild(messageElement);
    
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    

    // Efeito de digitação para o título principal
    const titleElement = document.querySelector('.hero-text h1');
    if (titleElement) {
        const title = titleElement.textContent;
        titleElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < title.length) {
                titleElement.textContent += title.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Iniciar efeito após 1 segundo
        setTimeout(typeWriter, 1000);
    }

    // Animação de números para a seção "Sobre"
    const animateNumbers = () => {
        const infoValues = document.querySelectorAll('.info-value');
        
        infoValues.forEach(value => {
            const target = parseInt(value.textContent);
            const duration = 2000; // 2 segundos
            const step = target / (duration / 20); // 20ms por passo
            
            let current = 0;
            value.textContent = '0';
            
            const updateNumber = () => {
                current += step;
                if (current < target) {
                    value.textContent = Math.floor(current) + (value.textContent.includes('+') ? '+' : '');
                    setTimeout(updateNumber, 20);
                } else {
                    value.textContent = target + (value.textContent.includes('+') ? '+' : '');
                }
            };
            
            // Iniciar animação quando o elemento estiver visível
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateNumber();
                    observer.disconnect();
                }
            });
            
            observer.observe(value);
        });
    };
    
    // Chamar função de animação de números
    animateNumbers();

    // Efeito parallax para o fundo da seção hero
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrollPosition = window.scrollY;
        
        if (hero) {
            hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        }
    });

    // Smooth scroll para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
