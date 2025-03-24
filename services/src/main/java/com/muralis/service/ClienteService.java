package com.muralis.service;

import java.util.List;
import java.util.Optional;


import org.springframework.stereotype.Service;

import com.muralis.modal.Cliente;
import com.muralis.repository.ClienteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    
    public Cliente save(Cliente cliente){
        return clienteRepository.save(cliente);
    }

    public List<Cliente> listAll(){
        return clienteRepository.findAll();
    }

    public Optional<Cliente> getById(Integer id){
        return clienteRepository.findById(id);
    }

    public Boolean existsByCpf(String cpf){
        return clienteRepository.existsByCpf(cpf);
    }

    public Optional<Cliente> update(Integer id, Cliente updatedCliente){
        return clienteRepository.findById(id).map(cliente ->{
            cliente.setNome(updatedCliente.getNome());
            cliente.setCpf(updatedCliente.getCpf());
            cliente.setData_nascimento(updatedCliente.getData_nascimento());
            cliente.setEndereco(updatedCliente.getEndereco());

            return clienteRepository.save(cliente);
        });
    }

    public boolean delete(Integer id){
        return clienteRepository.findById(id).map(client -> {
            clienteRepository.delete(client);
            return true;
        }).orElse(false);
    }
}
