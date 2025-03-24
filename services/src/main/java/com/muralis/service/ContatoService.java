package com.muralis.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.muralis.modal.Contato;
import com.muralis.repository.ContatoRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContatoService {

    private ContatoRepository contatoRepository;

    @Autowired
    public ContatoService(ContatoRepository contatoRepository) {
        this.contatoRepository = contatoRepository;
    }

    public List<Contato> listAllByCliente(Integer clienteId){
        return contatoRepository.findByClienteId(clienteId);
    }

    public Optional<Contato> getById(Integer id){
        return contatoRepository.findById(id);
    }

    public Contato save(Contato contato){
        return contatoRepository.save(contato);
    }

    public Contato update(Integer id, Contato contatoAtualizado) {
        return contatoRepository.findById(id).map(contato -> {
            contato.setTipo(contatoAtualizado.getTipo());
            contato.setValor(contatoAtualizado.getValor());
            contato.setObservacao(contatoAtualizado.getObservacao());
            return contatoRepository.save(contato);
        }).orElseThrow(() -> new EntityNotFoundException("Contato não encontrado"));
    }


    public void delete(Integer id){
        contatoRepository.deleteById(id);
    }

    public void deleteByClienteId(Integer clienteId){
        contatoRepository.deleteByClienteId(clienteId);
    }

}
