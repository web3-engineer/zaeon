import React from "react";
import ProjectCard from "../sub/ProjectCard";

const Projects = () => {
  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      id="projects"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-20">
        Casos de uso no mundo real
      </h1>
      <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10">
        <ProjectCard
          src="icons/DeFi.svg"
          title="Finanças Descentralizadas"
          description="Projetos que utilizam tecnologias blockchain para oferecer serviços financeiros sem a necessidade de bancos tradicionais."
        />
        <ProjectCard
          src="icons/EdFi.svg"
          title="Educational finances"
          description="Educação em todos os niveis da forma mais inteligente possivel."
          width={96}
          height={96}
          className="mx-auto w-[64px] sm:w-[80px] md:w-[96px]"
        />
        <ProjectCard
          src="icons/ReFi.svg"
          title="Regenarative finances"
          description="Projetos e Empresas que estão regenerando o planeta com tecnologias da Zaeon."
        />
      </div>
    </div>
  );
};

export default Projects;
